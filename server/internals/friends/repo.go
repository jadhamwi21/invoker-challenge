package friends

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/jadhamwi21/invoker-challenge/internals/sse"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type FriendsRepo struct {
	Db *mongo.Database
}

func NewFriendsRepo(db *mongo.Database) *FriendsRepo {
	return &FriendsRepo{Db: db}
}

func (Repo *FriendsRepo) FriendRequest(clientUsername string, friendUsername string) error {

	playersCollection := Repo.Db.Collection("players")

	friendFilter := bson.M{"username": friendUsername}
	clientFilter := bson.M{"username": clientUsername}
	friend := &models.BasePlayer{}
	client := &models.BasePlayer{}
	friendErr := playersCollection.FindOne(context.Background(), friendFilter).Decode(friend)
	clientErr := playersCollection.FindOne(context.Background(), clientFilter).Decode(client)
	if friendErr != nil {
		if errors.Is(friendErr, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return friendErr
	}
	if clientErr != nil {
		if errors.Is(clientErr, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return clientErr
	}
	if friend.ID == client.ID {
		return fiber.NewError(fiber.StatusBadRequest, "can't send friend request to yourself")
	}
	friendRequest := &models.FriendRequest{Timestamp: primitive.NewDateTimeFromTime(time.Now()), ID: primitive.NewObjectID(), Requester: client.ID, Requestee: friend.ID}
	friendRequestFilter := bson.M{
		"$or": []bson.M{
			{"requester": client.ID, "requestee": friend.ID},
			{"requester": friend.ID, "requestee": client.ID},
		},
	}
	friendsRequestsCollection := Repo.Db.Collection("friends_requests")
	friendRequestResult := friendsRequestsCollection.FindOne(context.Background(), friendRequestFilter)
	if friendRequestResult.Err() == nil {
		return nil
	}

	_, err := friendsRequestsCollection.InsertOne(context.Background(), friendRequest)
	if err != nil {
		return err
	}
	sse.SseService.SendEventToUser(friendUsername, sse.NewSSEvent("friend-request", map[string]interface{}{"request-id": friendRequest.ID, "username": clientUsername}))

	return nil
}

func (Repo *FriendsRepo) AcceptFriendRequest(clientUsername string, requestId string) error {
	friendsRequestsCollection := Repo.Db.Collection("friends_requests")
	requestObjectId, _ := primitive.ObjectIDFromHex(requestId)
	friendRequest := bson.M{"_id": requestObjectId}
	request := &models.FriendRequest{}
	err := friendsRequestsCollection.FindOne(context.Background(), friendRequest).Decode(request)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "request not found")
		}
		return err
	}
	playersCollection := Repo.Db.Collection("players")
	client := &models.BasePlayer{}
	err = playersCollection.FindOne(context.Background(), bson.M{"username": clientUsername}).Decode(client)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return err
	}

	requesteeId := request.Requestee
	requesterId := request.Requester
	if client.ID != requesteeId {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized to accept this request")
	}
	clientFilter := bson.M{"_id": requesterId}
	friendFilter := bson.M{"_id": requesteeId}
	playersCollection.UpdateOne(context.Background(), clientFilter, bson.M{"$push": bson.M{"friends": requesteeId}})
	playersCollection.UpdateOne(context.Background(), friendFilter, bson.M{"$push": bson.M{"friends": requesterId}})
	friend := &models.BasePlayer{}

	playersCollection.FindOne(context.Background(), friendFilter).Decode(friend)

	sse.SseService.SendEventToUser(friend.Username, sse.NewSSEvent("friend-request:accept", requestId))

	notification := &models.Notification{ID: primitive.NewObjectID(), UserID: request.Requester, Timestamp: primitive.NewDateTimeFromTime(time.Now()), Text: fmt.Sprintf("Your friend request to %v was accepted", client.Username)}
	notificationsCollection := Repo.Db.Collection("notifications")
	notificationsCollection.InsertOne(context.Background(), notification)
	sse.SseService.SendEventToUser(friend.Username, sse.NewSSEvent("notification", map[string]interface{}{"text": notification.Text, "timestamp": notification.Timestamp}))
	friendsRequestsCollection.DeleteOne(context.Background(), bson.M{"_id": request.ID})
	return nil
}

func (Repo *FriendsRepo) RejectFriendRequest(clientUsername string, requestId string) error {
	friendsRequestsCollection := Repo.Db.Collection("friends_requests")
	requestObjectId, _ := primitive.ObjectIDFromHex(requestId)
	friendRequest := bson.M{"_id": requestObjectId}
	request := &models.FriendRequest{}
	err := friendsRequestsCollection.FindOne(context.Background(), friendRequest).Decode(request)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "request not found")
		}
		return err
	}
	playersCollection := Repo.Db.Collection("players")
	client := &models.BasePlayer{}
	err = playersCollection.FindOne(context.Background(), bson.M{"username": clientUsername}).Decode(client)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "user not found")
		}
		return err
	}
	if client.ID != request.Requestee && client.ID != request.Requester {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized to reject this request")
	}
	friendsRequestsCollection.DeleteOne(context.Background(), request)
	friend := &models.BasePlayer{}
	friendFilter := bson.M{"_id": request.Requestee}
	playersCollection.FindOne(context.Background(), friendFilter).Decode(friend)
	sse.SseService.SendEventToUser(friend.Username, sse.NewSSEvent("friend-request:reject", requestId))
	return nil
}

func (Repo *FriendsRepo) GetFriendsByUsername(username string) ([]string, error) {

	playersCollection := Repo.Db.Collection("players")

	player := &models.BasePlayer{}

	err := playersCollection.FindOne(context.Background(), bson.M{"username": username}).Decode(player)
	if err != nil {
		return nil, err
	}

	friends := []string{}

	friendsFilter := bson.M{"_id": bson.M{"$in": player.Friends}}

	cursor, err := playersCollection.Find(context.Background(), friendsFilter)
	if err != nil {
		return nil, err
	}

	for cursor.Next(context.Background()) {
		var friend models.BasePlayer
		if err := cursor.Decode(&friend); err != nil {
			return nil, err
		}
		friends = append(friends, friend.Username)
	}

	return friends, nil
}

func (Repo *FriendsRepo) FriendStatusCheck(clientUsername string, friendUsername string) (interface{}, error) {

	playersCollection := Repo.Db.Collection("players")

	player := &models.BasePlayer{}

	err := playersCollection.FindOne(context.Background(), bson.M{"username": clientUsername}).Decode(player)
	if err != nil {
		return "", err
	}

	friendsFilter := bson.M{"_id": bson.M{"$in": player.Friends}}

	cursor, err := playersCollection.Find(context.Background(), friendsFilter)
	if err != nil {
		return "", err
	}

	for cursor.Next(context.Background()) {
		var friend models.BasePlayer
		if err := cursor.Decode(&friend); err == nil {
			if friend.Username == friendUsername {
				return map[string]interface{}{"status": "friend"}, nil
			}
		}
	}

	friend := &models.BasePlayer{}
	err = playersCollection.FindOne(context.Background(), bson.M{"username": friendUsername}).Decode(friend)
	if err != nil {
		return "", err
	}
	friendRequestFilter := bson.M{
		"$or": []bson.M{
			{"requester": player.ID, "requestee": friend.ID},
			{"requester": friend.ID, "requestee": player.ID},
		},
	}

	friendsCollection := Repo.Db.Collection("friends_requests")
	request := &models.FriendRequest{}
	err = friendsCollection.FindOne(context.Background(), friendRequestFilter).Decode(request)
	if err == nil {
		if player.ID == request.Requestee {
			return map[string]interface{}{"status": "pending-your-response", "requestId": request.ID}, nil
		} else {
			return map[string]interface{}{"status": "pending-his-response", "requestId": request.ID}, nil
		}
	}

	return map[string]interface{}{"status": "not-friend"}, nil
}

func (Repo *FriendsRepo) RemoveFriend(clientUsername string, friendUsername string) error {

	playersCollection := Repo.Db.Collection("players")

	friend := &models.BasePlayer{}
	friendFilter := bson.M{"username": friendUsername}

	err := playersCollection.FindOne(context.Background(), friendFilter).Decode(friend)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "friend with this username is not found")
		}
		return err
	}
	playersCollection.UpdateOne(context.Background(), bson.M{"username": clientUsername}, bson.M{"$pull": bson.M{"friends": friend.ID}})
	fmt.Println("update")
	return nil
}
