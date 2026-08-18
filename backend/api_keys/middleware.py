from django.http import JsonResponse
from .models import APIKey
from django.utils import timezone

class APIKeyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Verificar se é uma requisição de API
        if request.path.startswith('/api/'):
            api_key = request.headers.get('X-API-Key')
            if api_key:
                try:
                    key_obj = APIKey.objects.get(key=api_key, is_active=True)
                    key_obj.ultimo_uso = timezone.now()
                    key_obj.save()
                    request.revendedor = key_obj.revendedor
                except APIKey.DoesNotExist:
                    return JsonResponse({'erro': 'API Key inválida'}, status=401)
            else:
                # Permitir acesso a endpoints públicos
                if not request.path.startswith('/api/docs'):
                    pass
        
        return self.get_response(request)