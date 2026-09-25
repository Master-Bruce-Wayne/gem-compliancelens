import anthropic
from app.config import settings

class ExplanationService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = settings.LLM_MODEL

    def generate_explanation(self, rule_name: str, status: str, extracted_value: str, source: str) -> str:
        prompt = f"""
        You are a compliance assistant explaining a rule evaluation result to a procurement officer.
        Rule: {rule_name}
        Status: {status}
        Value found: {extracted_value or 'N/A'}
        Source: {source}
        
        Write a single clear, professional sentence explaining this result. 
        Do not change the status or make a judgment. Only explain what was found.
        """
        
        if not settings.ANTHROPIC_API_KEY or settings.ANTHROPIC_API_KEY == "your-key-here":
            # Issue 34 Implementation: Use free Pollinations.ai API if no paid key is available
            import urllib.request
            import urllib.parse
            import json
            try:
                data = json.dumps({"messages": [{"role": "user", "content": prompt}]}).encode("utf-8")
                req = urllib.request.Request("https://text.pollinations.ai/", data=data, headers={"Content-Type": "application/json"})
                response = urllib.request.urlopen(req, timeout=10)
                return response.read().decode("utf-8").strip()
            except Exception as e:
                return f"System Explanation: The {rule_name} check resulted in {status} based on {source}."

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=100,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text
        except Exception as e:
            return f"Error generating explanation: {str(e)}"
