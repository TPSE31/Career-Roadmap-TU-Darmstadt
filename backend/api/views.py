from django.http import HttpResponse
from django.http import JsonResponse

def hello_world(request):
    return HttpResponse("Hello World from Gruppe 31!")

def basic_user_info(request):
    data = {
        "name": "Demo Student",
        "semester": 3,
        "program": "Informatik B.Sc.",
        "credits_completed": 45,
    }
    return JsonResponse(data)

def program_overview(request):
    data = {
        "program": "Informatik B.Sc.",
        "total_credits": 180,
        "semesters": 6,
    }
    return JsonResponse(data)

def module_list(request):
    data = {
        "modules": [
            {"name": "Mathe 1", "credits": 9, "status": "done"},
            {"name": "Programmierung 1", "credits": 9, "status": "done"},
            {"name": "Datenbanken", "credits": 6, "status": "in_progress"},
        ]
    }
    return JsonResponse(data)