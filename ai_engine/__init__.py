"""
AI Engine Package — Claude-powered MDMP reasoning core

Uses Anthropic Claude API with doctrine-engineered system prompts.
"""

from .engine import AIEngine, ConversationSession

__all__ = [
    "AIEngine",
    "ConversationSession",
]
