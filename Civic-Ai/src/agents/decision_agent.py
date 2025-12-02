"""
DecisionAgent merges Vision output + RAG results and returns final department mapping.
For simplicity, we map issue_type -> department by either:
 - evidence from top RAG texts (search for department keywords), or
 - fallback to a static dictionary.
"""
import re

STATIC_MAP = {
    "pothole": "Roads & Highways",              
    "garbage": "Sanitation Department",
    "garbage_overflow": "Sanitation Department",
    "water_leak": "Water Supply Board",         
    "dead_animal": "Sanitation Department",     
    "streetlight": "Electricity Board",
    "streetlight_off": "Electricity Board",
    "drain_block": "Water Supply Board",        
    "fallen_tree": "Forestry Department",       
    "illegal_parking": "General Administration",
    "fire_hazard": "General Administration"     
}

def map_department_from_evidence(evidence_list, issue_type):
    keywords = {
        "sanitation": ["sanitation", "waste", "garbage"],
        "electricity": ["electricity", "streetlight", "light"],
        "roads": ["pothole", "road", "highway"],
        "water": ["water", "pipeline", "leak"],
        "drain": ["drain", "sewage", "drainage"],
        "traffic": ["traffic", "parking", "ticket", "police"],
        "animals": ["animal", "stray", "dog", "animal control"],
        "fire": ["fire", "flammable", "extinguisher"]
    }
    
    text_combined = " ".join([e["text"].lower() for e in evidence_list])
    
    for key, kws in keywords.items():
        for kw in kws:
            if kw in text_combined:
                mapping = {
                    "sanitation": "Sanitation Department",
                    "electricity": "Electricity Board",
                    "roads": "Roads & Highways",        
                    "water": "Water Supply Board",      
                    "drain": "Water Supply Board",      
                    "traffic": "General Administration",
                    "animals": "Sanitation Department", 
                    "fire": "General Administration"    
                }
                return mapping.get(key)
                
    return STATIC_MAP.get(issue_type, "General Administration")

def make_decision(vision_output, rag_results):
    issue = vision_output.get("issue_type")
    conf = vision_output.get("category_confidence")
    severity = vision_output.get("severity")
    
    dept = STATIC_MAP.get(issue)

    if not dept:
        dept = map_department_from_evidence(rag_results or [], issue)

    if not dept:
        dept = "General Administration"

    evidence_texts = [e["text"] for e in (rag_results or [])]
    reason = f"AI detected '{issue}' with {conf:.2f} confidence. Assigned to {dept}."
    
    if evidence_texts:
        reason += f" Relevant Rule: {evidence_texts[0][:100]}..."

    return {
        "issue_type": issue,
        "department": dept,
        "confidence": conf,
        "severity": severity,
        "evidence": evidence_texts,
        "decision_reason": reason
    }