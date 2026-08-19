import cloudinary
import cloudinary.uploader
import cloudinary.api

cloudinary.config(
    cloud_name = "Nelson",
    api_key = "939286921812253", 
    api_secret = "61BWv7uwyExa_0pbrjYW19EAyJo"
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'