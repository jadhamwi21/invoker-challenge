package auth

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jadhamwi21/invoker-challenge/internals/models"
	"github.com/spf13/viper"
)

func GenerateJwt(player *models.BasePlayer) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &models.PlayerClaims{Username: player.Username, ID: player.ID.Hex()})

	secret := []byte(viper.GetString("SECRET"))
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ParseToken(tokenString string) (*models.PlayerClaims, error) {

	secret := []byte(viper.GetString("SECRET"))
	token, err := jwt.ParseWithClaims(tokenString, &models.PlayerClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return token.Claims.(*models.PlayerClaims), nil
}
