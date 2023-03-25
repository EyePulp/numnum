from django.conf import settings
from django.http import FileResponse, HttpResponse
from django.views.decorators.http import require_GET
import logging

logger = logging.getLogger(__name__)


@require_GET
def frontend_index(request, path=""):
    index_file = (settings.BASE_DIR / ".." / "frontend-dist" / "index.html").open("rb")
    logger.warn(index_file)
    return FileResponse(index_file)


def index(request):
    return HttpResponse("Hello world?")
