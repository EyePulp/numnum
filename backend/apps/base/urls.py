from django.urls import path, re_path

from . import views

urlpatterns = [
    # path("", views.frontend_index, name="frontend_index"),
    # path("<path:path>", views.frontend_index),
    re_path(r".*", views.frontend_index),
]
