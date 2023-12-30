package configs

import "github.com/spf13/viper"

func EnvConfig() {
	viper.SetConfigFile(".env")
	viper.ReadInConfig()
}
