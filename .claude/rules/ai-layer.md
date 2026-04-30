---
paths:
  - "src/ai/**/*.ts"
  - "src/ai/**/*.tsx"
---

# AI Layer Rules (Generative UI Engine)

- Context analysis is 100% local. Never send note content for context analysis.
- LLM routing sends only structural metadata (content type, block count, keywords), not content text.
- Always implement a fast local matching path before LLM routing. Most cases should resolve without LLM.
- AI features must be opt-in. Default to local AI (Ollama). Cloud AI (Claude API) requires explicit consent.
- Cache LLM routing decisions per content-type pattern to minimize API calls.
- Fallback: if LLM routing fails, silently fall back to default editor view. Never show AI errors to user.
- User override always wins. "Pin this view" disables auto-switching for that note.
- Component registry: every Generative UI view must register with name, description, triggers, and content types.
- Use `claude-sonnet-4-6` for routing (fast). Reserve `claude-opus-4-7` for content generation only.
- Rate limit LLM calls: max 1 routing call per note open, debounce content-change triggers to 500ms minimum.
