#!/bin/bash

# Instalar dependências
pip install -r requirements.txt

# Recolher ficheiros estáticos
python manage.py collectstatic --no-input

# Aplicar migrações
python manage.py migrate