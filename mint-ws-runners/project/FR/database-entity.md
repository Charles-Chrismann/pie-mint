# Entités

Cette page est destiné à décrire les différentes entité que l'on rencontrera au sein de l'application.

Chaque entité devra être brièvement décrite, ainsi que les champs nécessaire en base de donné et les relations qu'elles ont avec les autres entités

> [!NOTE]
> Pour le moment, il n'est pas obligatoire de décrire les ids, clés primaires et secondaires (mais c'est bien quand même)

> [!NOTE]
> Si les descriptions sont dans la langue du document, le nom de l'entité doit refléter son nom dans la base de données et par conséquent être en anglais (la première lettre en majuscule est toléré).

## Liste des entités


TODO: Ajouter une table de contenu

---

### `Nom de l'entité`

Description de l'entité

|Nom du champ                    | Unique | Type           | Nullable | Default        | Description                    |
|:-------------------------------|:------:|:---------------|:--------:|:--------------:|:-------------------------------|
| id                             | ✅     | Int            | ❌       |                | id                             |
| username                       | ✅     | string         | ❌       |                | Le nom d'utilisateur           |
| un_truc_nullable               | ❌     | string         | ✅       |                | Un champ nullable sur mon entité |

> Relations:
> - [`entity`](#entity_link): 1---1 (Le symbole à gauche est relatif à l'entité distante, à droite, l'entité actuelle)

---

> [!TIP]
> Copiez ce template d'entité lors de l'ajout d'une nouvelle entité

---

### `user`

Un utilisateur

|Nom du champ| Type | Nullable | Default | Description |
|:-----------|:----:|:--------:|:-------:|:------------|
| username | string | ❌ |  | Le nom d'utilisateur |
| email | string | ❌ |  | L'adresse email de l'utilisateur |

> Relations:
> - [`athlete_profile`](#athlete_profile): 1---1

---

### `user_setting_category`

Représente une catégorie de settings.

Ex: Notifications, Privacy

|Nom du champ | Unique | Type | Nullable | Default | Description |
|:------------|:------:|:----:|:--------:|:-------:|:------------|
| id          | ✅     | Int | ❌ |  |  |
| name        | ✅     | string | ❌ |  |  |
| description | ❌     | string | ✅ |  |  |

---

### `user_setting_key`

Représente une clé de settings.

|Nom du champ | Unique | Type   | Nullable | Default | Description |
|:------------|:------:|:------:|:--------:|:-------:|:------------|
| id          | ✅     | Int    | ❌ |  |  |
| key         | ✅     | string | ❌ |  |  |
| label       | ❌     | string | ✅ |  |  |
| type        | ❌     | string | ✅ |  |  |
| default     | ❌     | string | ✅ |  |  |
| description | ❌     | string | ✅ |  |  |
| category_id | ❌     | Int    | ✅ |  | Si null, alors global |

---

### `user_setting`

Représente une valeur de settings différente de celle par défault.

|Nom du champ | Unique | Type   | Nullable | Default | Description |
|:------------|:------:|:------:|:--------:|:-------:|:------------|
| id          | ✅     | Int    | ❌ |  |  |
| value       | ✅     | string | ❌ |  |  |
| key_id      | ❌     | Int    | ✅ |  |  |
| user_id     | ❌     | Int    | ✅ |  |  |

---

### `athlete_profile`

|Nom du champ| Unique | Type | Nullable | Default | Description |
|:-----------|:------:|:----:|:--------:|:-------:|:------------|
| username   | ✅     | string | ❌ |  | Le nom d'utilisateur |
| firstname | string | ✅ |  | Le prénom de l'utilisateur |
| lastname | string | ✅ |  | Le nom de l'utilisateur |

---

### `organization`

Décrit une entité qui organise une course, ex: Schneider Electric Marathon de Paris, Ville de Nantes, Eiffage.

Une organization est crée par un user et déténue par un user, chaque organization possède ses propres rôles

|Nom du champ   | Type   | Nullable | Unique | Default | Description                                                   |
|:--------------|:------:|:--------:|:------:|:-------:|:--------------------------------------------------------------|
| name          | string | ❌       | ✅     |         | Le nom de l'entité organisatrice                              |
| avatar_url    | string | ❌       | ✅     |         | L'url de l'avatar de l'organization                           |
| banner_url    | string | ❌       | ✅     |         | L'url de la banièere de l'organization                        |
| created_by_id | Int    | ❌       | ✅     |         | L'id de l'utilisateur ayant crée l'organization               |
| owner_id       | Int    | ❌       | ✅     |         | L'id de l'utilisateur qui détient actuellement l'organiztion  |

> Relations:
> - `created_by_id`: [`user`](#user) 1---1
> - `owner_id`: [`user`](#user) 1---1

---

### `organization_member`

|Nom du champ   | Type   | Nullable | Unique | Default | Description                                                   |
|:--------------|:------:|:--------:|:------:|:-------:|:--------------------------------------------------------------|
| id            | Int | ❌       | ✅     |         | id                             |
| athlete_profile_id            | Int | ❌       | ✅     |         | id                             |
| organization_id            | Int | ❌       | ✅     |         | id                             |

---

### `organization_event_member`

Représente les membres temporaire d'une organization sur un évènement, par exemple les bénévoles.

|Nom du champ                    | Unique | Type           | Nullable | Default        | Description                    |
|:-------------------------------|:------:|:---------------|:--------:|:--------------:|:-------------------------------|
| id                             | ✅     | Int            | ❌       |                | id                             |
| athlete_profile_id             | ✅     | Int            | ❌       |                | athlete_profile_id             |
| event_id                       | ✅     | Int            | ❌       |                | event_id                       |

---

### `organization_permission`

Représente un permission relative à l'organisation d'une organization

|Nom du champ                    | Unique | Type           | Nullable | Default        | Description                    |
|:-------------------------------|:------:|:---------------|:--------:|:--------------:|:-------------------------------|
| id                             | ✅     | Int            | ❌       |                | id                             |
| name                           | ✅     | string         | ❌       |                | Le nom de la permission        |

---

### `organization_role`

Représente un rôle défini prédéfini ou crée par une organisation

Ex: Volonteer, staff

|Nom du champ                    | Type   | Nullable | Unique | Default | Description                                                   |
|:-------------------------------|:------:|:--------:|:------:|:-------:|:--------------------------------------------------------------|
| id                             | Int | ❌       | ✅     |         | L'id                              |
| name                           | string | ❌       | ✅     |         | Le nom de l'entité organisatrice                              |
| isSystem                       | boolean | ❌       | ✅     |         | Le nom de l'entité organisatrice                              |
| organization_id                | string | ❌       | ✅     |         | Le nom de l'entité organisatrice                              |

> Relations:
> - `organization_id`: [`organization`](#organization) 1---1

---

### `organization_role_assignment`

Description de l'entité

|Nom du champ                    | Unique | Type           | Nullable | Default        | Description                    |
|:-------------------------------|:------:|:---------------|:--------:|:--------------:|:-------------------------------|
| id                             | ✅     | Int            | ❌       |                | id                             |
| organization_role_id           | ✅     | Int            | ❌       |                | id                             |
| organization_member_id         | ✅     | Int            | ✅       |                | id                             |
| organization_group_id          | ✅     | Int            | ✅       |                | id                             |
| event_id                       | ✅     | Int            | ✅       |                | id                             |

---

### `organization_role_permission`

Description de l'entité

|Nom du champ                    | Unique | Type           | Nullable | Default        | Description                    |
|:-------------------------------|:------:|:---------------|:--------:|:--------------:|:-------------------------------|
| id                             | ✅     | Int            | ❌       |                | id                             |

---

### `organization_group`

|Nom du champ   | Type   | Nullable | Unique | Default | Description                                                   |
|:--------------|:------:|:--------:|:------:|:-------:|:--------------------------------------------------------------|
| id           | Int | ❌       | ✅     |         | L'id                              |
| name           | String | ❌       | ✅     |         | Le nom du groupe                              |
| isSystem | boolean | ❌       | ✅     |         |                               |
| organization_id | Int | ❌       | ✅     |         |                            |

> Relations:
> - `organization_group_membership`: [`organization_group_membership`](#organization_group_membership) n---1
> - `organization_role_assignment`: [`organization_group_membership`](#organization_group_membership) n---1
> - `organization_permission_grant`: [`organization_group_membership`](#organization_group_membership) n---1

---

### `organization_group_membership`

|Nom du champ                    | Unique | Type           | Nullable | Default        | Description                    |
|:-------------------------------|:------:|:---------------|:--------:|:--------------:|:-------------------------------|
| id                             | ✅     | string         | ❌       |                | id                             |
| organization_member_id         | ✅     | string         | ❌       |                | organization_member_id         |
| organization_group_id          | ✅     | string         | ❌       |                | organization_group_id          |

---

### `organization_permission_grant`

Description de l'entité

|Nom du champ                    | Unique | Type           | Nullable | Default        | Description                    |
|:-------------------------------|:------:|:---------------|:--------:|:--------------:|:-------------------------------|
| id                             | ✅     | Int            | ❌       |                | id                             |
| permission_id                  | ✅     | Int            | ❌       |                | id                             |
| organization_member_id         | ✅     | Int            | ✅       |                | id                             |
| organization_group_id          | ✅     | Int            | ✅       |                | id                             |
| event_id                       | ✅     | Int            | ✅       |                | id                             |

---

> [!INFO]
> Explication du fonctionnement du système de permission/rôle/groupes.



---

### `event`

Relatif à une organisation, un évènement décrit une course où une série de courses si plusieurs épreuves, chaque évènement possède ses propres rôles

> Relations:
> - `sub_event`

---

### `social_link`

Représente les réseaux sociaux à afficher sur le profile d'un [`user`](#user), d'une [`organization`](#organization), d'un [`event`](#event)

> Relations:
> - [`social_plateform`](#social_plateform): 1---1
> - [`user`](#user): 1---1?
> - [`organization`](#organization): 1---1?
> - [`event`](#event): 1---1?

---

### `social_plateform`

Représente les différents réseaux sociaux

|Nom du champ     | Unique | Type   | Nullable | Default | Description                      |
|:----------------|:------:|:------:|:--------:|:-------:|:---------------------------------|
| name            | ✅     | string | ❌       |         | Le nom du réseaux social         |
| icon_url        | ✅     | string | ❌       |         | L'url de l'icon du réseau sociale|

> Relations:
> - [`social_link`](#social_link): 1---1

---

### `sub_event`

|Nom du champ| Type   | Nullable | Unique | Default | Description                      |
|:-----------|:------:|:--------:|:------:|:-------:|:---------------------------------|
| name       | string | ❌       | ✅     |         | Le nom de l'épreuve              |

Relatif à un [`event`](#event), il décrit les différentes épreuves de cette évènement.

> Relations:
> - [`event`](#event): 1---n

> [!NOTE]
> Un [`user`](#user) peut prendre part à plusieurs évènements d'un même évènment sauf s'ils se déroule en même temps.

> [!IMPORTANT]
> Prévoir un système pour permettre aux évènements de s'exclure entre eux.

---

### `standard_distance`

Relatif à un [`sub_event`](#sub_event) elle représente les distances classique que l'on peut retrouver.

Ex: Marathon, Semi, 10K

|Nom du champ| Type   | Nullable | Unique | Default | Description                      |
|:-----------|:------:|:--------:|:------:|:-------:|:---------------------------------|
| name       | string | ❌       | ✅     |         | Le nom de la distance            |
| distance   | Int    | ❌       | ✅     |         | La distance en mètres            |

> Relations:
> - [`sub_event`](#sub_event): 1---1

---

### `registration`

Relatif à un [`user`](#user) et à un [`sub_event`](#sub_event), elle représente l'inscription d'un utilisateur à une épreuve.

|Nom du champ     | Type   | Nullable | Unique | Default | Description                                                                     |
|:----------------|:------:|:--------:|:------:|:-------:|:--------------------------------------------------------------------------------|
| isPrivate       | string | ❌       | ✅     |         | Est-ce que les informations du coureur sont cachés pendant cette course, override ce qui est défini dans les user_settings |
| bib_number      | string | ❌       | ✅     |         | Le numéro de dossard, unique [`sub_event`, bib_number]                          |
| bib_alias       | string | ✅       | ❌     |         | Le nom affiché sur le dossard                                                    |

> Relations:
> - [`user`](#user): 1---1
> - [`sub_event`](#sub_event): 1---1

---

### Role

Relatif à un évènement, un role regroupe un ensemble d'utilisateurs qui ont des habilitations sur 

---

### Authorization

Une habilitation décrit la permission d'un utilisateur de faire une action sur un évènement ou une organization.