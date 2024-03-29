package validation

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

func formatTag(field string, tag string) string {
	field = strings.ToLower(field)
	switch tag {
	case "required":
		return fmt.Sprintf("%v is required", field)
	case "min":
		return fmt.Sprintf("invalid %v length", field)
	}
	return ""
}

func FormatValidationError(validationError error) map[string]interface{} {
	err := validationError.(validator.ValidationErrors)

	errMap := map[string]interface{}{}
	for _, current := range err {

		errMap[strings.ToLower(current.Field())] = formatTag(current.Field(), current.Tag())
	}

	return errMap
}
