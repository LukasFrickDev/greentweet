from django.http import JsonResponse


def health_check(request):
    """Public liveness endpoint for infrastructure checks."""
    return JsonResponse({"status": "ok"})
