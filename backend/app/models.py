# Placeholder for database models 
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(String(64), unique=True, index=True)
    name = Column(String(128))
    email = Column(String(128), unique=True, index=True)
    avatar_url = Column(String(256))
    reviews = relationship("CodeReview", back_populates="user")
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team = relationship("Team", back_populates="members")

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), unique=True)
    members = relationship("User", back_populates="team")

class CodeReview(Base):
    __tablename__ = "code_reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    code = Column(Text)
    language = Column(String(32))
    pylint = Column(Text)
    bandit = Column(Text)
    black = Column(Text)
    ai_feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="reviews") 