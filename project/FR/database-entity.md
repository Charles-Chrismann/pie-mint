# Entités

Cette page est destiné à décrire les différentes entité que l'on rencontrera au sein de l'application.

Chaque entité devra être brièvement décrite, ainsi que les champs nécessaire en base de donné et les relations qu'elles ont avec les autres entités

> [!NOTE]
> Pour le moment, il n'est pas obligatoire de décrire les ids, clés primaires et secondaires (mais c'est bien quand même)

> [!NOTE]
> Si les descriptions sont dans la langue du document, le nom de l'entité doit refléter son nom dans la base de donnés et par conséquent être en anglais (la première lettre en majuscule est toléré).

## Liste des entités


TODO: Ajouter une table de contenu

---

### Nom de l'entité

Description de l'entité

|Nom du champ| Type | Nullable | Default | Description |
|:----------:|:----:|:--------:|:-------:|:-----------:|
| username | string | ❌ |  | Le nom d'utilisateur |
| un_truc_nullable | string | ✅ |  | Un champ nullable sur mon entité |

---

> [!TIP]
> Copiez ce template d'entité lors de l'ajout d'une nouvelle entité

### User

Un utilisateur

|Nom du champ| Type | Nullable | Default | Description |
|:----------:|:----:|:--------:|:-------:|:-----------:|
| username | string | ❌ |  | Le nom d'utilisateur |
| email | string | ❌ |  | L'adresse email de l'utilisateur |
| firstname | string | ✅ |  | Le prénom de l'utilisateur |
| lastname | string | ✅ |  | Le nom de l'utilisateur |

### Organization

Décrit une entité qui organise une course, ex: Schneider Electric Marathon de Paris, Ville de Nantes, Eiffage.

Une organization est crée par un user et déténue par un user, chaque organization possède ses propres rôles

|Nom du champ| Type | Nullable | Default | Description |
|:----------:|:----:|:--------:|:-------:|:-----------:|
| name | string | ❌ |  | Le nom de l'entité organisatrice |

### Evenement

Relatif à une organisation, un évènement décrit une course, chaque évènement possède ses propres rôles

### Role

Relatif à un évènement, un role regroupe un ensemble d'utilisateurs qui ont des habilitations sur 

### Authorization

Une habilitation décrit la permission d'un utilisateur de faire une action sur un évènement ou une organization.