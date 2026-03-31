# Cómo Desplegar Firestore Rules

Las reglas de seguridad de Firestore deben desplegarse manualmente al proyecto de Firebase.

## Opción 1: Firebase Console (Más Fácil)

1. Ve a: https://console.firebase.google.com
2. Selecciona el proyecto: **casa-bella-lrs**
3. En el menú izquierdo: **Build → Firestore Database**
4. Click en la pestaña **"Rules"**
5. Copia el contenido de `firestore.rules` de este proyecto
6. Pégalo en el editor
7. Click en **"Publish"**

## Opción 2: Firebase CLI

Si tienes Firebase CLI instalado:

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Login
firebase login

# En la carpeta del proyecto
cd casa-bella

# Inicializar (solo la primera vez)
firebase init firestore
# Selecciona:
# - Existing project: casa-bella-lrs
# - Firestore Rules: firestore.rules
# - Skip Firestore Indexes

# Desplegar reglas
firebase deploy --only firestore:rules
```

## ⚠️ Importante

Las reglas actualizadas permiten que usuarios autenticados lean la colección `admins` para verificar su estado de administrador. Esto es necesario para el sistema de autenticación.

## Verificar Reglas Desplegadas

Después de desplegar, verifica en Firebase Console → Firestore Database → Rules que las reglas estén actualizadas.
