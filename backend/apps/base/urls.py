from django.urls import path, re_path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path("", views.frontend_index, name="frontend_index"),
    # path("", views.index),
    # path("<path:path>", views.frontend_index),
    # re_path(r"^.*", views.frontend_index),
    # re_path(r"^(?P<path>([^/]+/)*)$", views.frontend_index, name="frontend_index"),
    # re_path("", TemplateView.as_view(template_name="index.html")),
]
