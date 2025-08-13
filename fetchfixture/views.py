import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@csrf_exempt
def upcoming_matches(request):
    try:
        # Get API token from settings (more secure)
        API_TOKEN = getattr(settings, 'SPORTSMONKS_API_TOKEN', '')
        
        # Make the API request with proper headers
        response = requests.get(
            'https://api.sportmonks.com/v3/football/fixtures/upcoming',
            params={
                'api_token': API_TOKEN,
                'include': 'participants',  # Try removing this if still failing
                'per_page': 5,  # Reduced from 10 to 5
                'filters': 'status:NS'  # Only get Not Started matches
            },
            headers={
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        )
        
        # Check for specific status codes
        if response.status_code == 422:
            return JsonResponse({
                'error': 'Validation failed',
                'details': response.json().get('message', 'Unknown validation error')
            }, status=422)
            
        response.raise_for_status()  # Raises HTTPError for bad responses
        return JsonResponse(response.json())
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({
            'error': 'Failed to fetch matches',
            'details': str(e)
        }, status=500)