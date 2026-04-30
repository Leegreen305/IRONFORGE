"""
AI Engine

Claude-powered reasoning core for MDMP tasks.
"""

import os
from typing import List, Dict, Optional
from dataclasses import dataclass, field

from anthropic import Anthropic
from anthropic.types import Message

from ai_engine.system_prompt import MDMP_SYSTEM_PROMPT
from ironforge.base_classes import Scenario


@dataclass
class ConversationSession:
    """Maintains conversation history for iterative refinement."""
    session_id: str
    messages: List[Dict[str, str]] = field(default_factory=list)

    def add_user(self, content: str):
        self.messages.append({"role": "user", "content": content})

    def add_assistant(self, content: str):
        self.messages.append({"role": "assistant", "content": content})

    def to_api_messages(self) -> List[Dict[str, str]]:
        return self.messages


class AIEngine:
    """Claude-based AI engine for MDMP reasoning."""

    MODEL = "claude-sonnet-4-20250514"

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY environment variable is required. "
                "Set it before starting IRONFORGE or pass api_key explicitly."
            )
        self.client = Anthropic(api_key=self.api_key)
        self.sessions: Dict[str, ConversationSession] = {}

    def start_session(self, session_id: str) -> ConversationSession:
        session = ConversationSession(session_id=session_id)
        self.sessions[session_id] = session
        return session

    def get_session(self, session_id: str) -> Optional[ConversationSession]:
        return self.sessions.get(session_id)

    def _call(self, messages: List[Dict[str, str]], max_tokens: int = 2048) -> str:
        try:
            response: Message = self.client.messages.create(
                model=self.MODEL,
                max_tokens=max_tokens,
                system=MDMP_SYSTEM_PROMPT,
                messages=messages,
            )
            return response.content[0].text
        except Exception as e:
            return f"[AI ENGINE ERROR] {type(e).__name__}: {str(e)}"

    def generate_coa_narratives(self, scenario: Scenario, session_id: Optional[str] = None) -> str:
        """Generate three COA narratives using AI reasoning."""
        prompt = self._scenario_prompt(scenario)
        content = (
            f"{prompt}\n\n"
            "Develop three distinct Courses of Action (COA-A, COA-B, COA-C) for this scenario. "
            "Each COA must include decisive operation, shaping operations, sustaining operation, and risk assessment. "
            "Cite FM 6-0 and JP 3-0 where applicable."
        )
        messages = [{"role": "user", "content": content}]
        if session_id and session_id in self.sessions:
            self.sessions[session_id].add_user(content)
            response_text = self._call(
                self.sessions[session_id].to_api_messages())
            self.sessions[session_id].add_assistant(response_text)
        else:
            response_text = self._call(messages)
        return response_text

    def wargame_analysis(self, scenario: Scenario, coa_description: str, session_id: Optional[str] = None) -> str:
        """Generate wargaming action/reaction/counteraction analysis."""
        content = (
            f"Scenario: {scenario.title}\n"
            f"Mission type: {scenario.mission_type.value}\n"
            f"COA to wargame: {coa_description}\n\n"
            "Wargame this COA using structured action/reaction/counteraction sequences per FM 6-0, para 9-105. "
            "Identify strengths, weaknesses, hazards, branches, and sequels. "
            "Cite FM 6-0 where applicable."
        )
        messages = [{"role": "user", "content": content}]
        if session_id and session_id in self.sessions:
            self.sessions[session_id].add_user(content)
            response_text = self._call(
                self.sessions[session_id].to_api_messages())
            self.sessions[session_id].add_assistant(response_text)
        else:
            response_text = self._call(messages)
        return response_text

    def generate_opord_fragment(self, scenario: Scenario, approved_coa_description: str, session_id: Optional[str] = None) -> str:
        """Generate an OPORD fragment with proper paragraph numbering."""
        content = (
            f"Scenario: {scenario.title}\n"
            f"Approved COA: {approved_coa_description}\n\n"
            "Generate a structured OPORD fragment per FM 6-0, Appendix C. "
            "Include paragraphs 1 (Situation), 2 (Mission), 3 (Execution), 4 (Sustainment), and 5 (Command and Signal). "
            "Use proper military paragraph numbering."
        )
        messages = [{"role": "user", "content": content}]
        if session_id and session_id in self.sessions:
            self.sessions[session_id].add_user(content)
            response_text = self._call(
                self.sessions[session_id].to_api_messages())
            self.sessions[session_id].add_assistant(response_text)
        else:
            response_text = self._call(messages)
        return response_text

    def refine(self, session_id: str, user_request: str) -> str:
        """Iterative refinement using conversation history."""
        if session_id not in self.sessions:
            raise ValueError(
                f"Session {session_id} not found. Start a session first.")
        self.sessions[session_id].add_user(user_request)
        response_text = self._call(self.sessions[session_id].to_api_messages())
        self.sessions[session_id].add_assistant(response_text)
        return response_text

    @staticmethod
    def _scenario_prompt(scenario: Scenario) -> str:
        lines = [
            f"Title: {scenario.title}",
            f"Description: {scenario.description}",
            f"Mission Type: {scenario.mission_type.value}",
            f"Friendly Forces: {', '.join([u.name for u in scenario.friendly_force])}",
        ]
        if scenario.enemy_force:
            lines.append(
                f"Enemy Forces: {', '.join([e.name for e in scenario.enemy_force])}")
        if scenario.terrain:
            lines.append(
                f"Terrain: {', '.join([t.name for t in scenario.terrain])}")
        if scenario.weather:
            lines.append(f"Weather: {scenario.weather.condition.value}")
        if scenario.time_available:
            lines.append(f"Time Available: {scenario.time_available}")
        return "\n".join(lines)
