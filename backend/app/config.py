from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ANTHROPIC_API_KEY: str = ""
    LLM_MODEL: str = "claude-3-5-sonnet-20240620"
    ENVIRONMENT: str = "development"
    MOCK_REGISTRY_MODE: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
