import os
import sys
import django
from django.conf import settings

print("🔧 INICIANDO DIAGNÓSTICO DO ERRO 500...")
print("=" * 50)

# 1. Verificar ficheiros importantes
print("\n📁 1. Verificando ficheiros importantes...")
arquivos = ['manage.py', 'inuka/settings.py', 'inuka/urls.py']
for arquivo in arquivos:
    if os.path.exists(arquivo):
        print(f"   ✅ {arquivo} encontrado")
    else:
        print(f"   ❌ {arquivo} NÃO encontrado")

# 2. Verificar sintaxe do settings.py (com encoding correto)
print("\n📝 2. Verificando sintaxe do settings.py...")
try:
    with open('inuka/settings.py', 'r', encoding='utf-8') as f:
        conteudo = f.read()
    compile(conteudo, 'settings.py', 'exec')
    print("   ✅ settings.py está sintaticamente correto")
except SyntaxError as e:
    print(f"   ❌ Erro de sintaxe no settings.py: {e}")
except UnicodeDecodeError:
    print("   ⚠️ Problema de encoding no settings.py")
    print("   🔧 Tentando ler com encoding diferente...")
    try:
        with open('inuka/settings.py', 'r', encoding='latin-1') as f:
            conteudo = f.read()
        compile(conteudo, 'settings.py', 'exec')
        print("   ✅ settings.py lido com encoding latin-1")
    except Exception as e:
        print(f"   ❌ Erro: {e}")

# 3. Verificar variáveis de ambiente
print("\n🔑 3. Verificando variáveis de ambiente...")
vars_necessarias = ['DATABASE_URL', 'SECRET_KEY']
for var in vars_necessarias:
    if os.getenv(var):
        print(f"   ✅ {var} configurada")
    else:
        print(f"   ❌ {var} NÃO configurada")

# 4. Verificar a base de dados
print("\n🗄️ 4. Verificando conexão com a base de dados...")
try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inuka.settings')
    django.setup()
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    print("   ✅ Conexão com a base de dados OK")
except Exception as e:
    print(f"   ❌ Erro na base de dados: {e}")

# 5. Verificar apps instaladas
print("\n📦 5. Verificando apps instaladas...")
try:
    from django.apps import apps
    apps_instaladas = [app.name for app in apps.get_app_configs()]
    print(f"   ✅ {len(apps_instaladas)} apps encontradas")
except Exception as e:
    print(f"   ❌ Erro ao verificar apps: {e}")

print("\n" + "=" * 50)
print("✅ DIAGNÓSTICO CONCLUÍDO!")