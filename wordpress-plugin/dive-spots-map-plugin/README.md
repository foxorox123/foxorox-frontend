# Dive Spots World Map (WordPress plugin)

Wtyczka dodaje bazę miejsc nurkowych z workflow moderacji.

## Funkcje
- Custom Post Type `dive_spot` (miejsca nurkowe).
- Frontowy formularz dodawania i edycji miejsca przez zalogowanych użytkowników.
- Każde nowe/edytowane miejsce trafia w status `pending` do moderacji.
- Obsługa zdjęć (wiele plików) i zapis galerii.
- Mapa z zatwierdzonymi miejscami (Leaflet + OpenStreetMap).
- Endpoint REST z danymi zaakceptowanych miejsc.

## Wymagania
- WordPress 6.x
- PHP 8.0+
- Włączone „Przyjazne linki” (Ustawienia → Bezpośrednie odnośniki)

## Instalacja na WordPress (krok po kroku)

### Opcja A: instalacja przez panel admina (ZIP)
1. Przygotuj paczkę ZIP (z repo):
   ```bash
   bash wordpress-plugin/dive-spots-map-plugin/build-zip.sh
   ```
2. Otrzymasz plik:
   - `wordpress-plugin/dist/dive-spots-map-plugin.zip`
3. W WordPress przejdź do **Wtyczki → Dodaj nową → Wyślij wtyczkę na serwer**.
4. Wgraj plik ZIP i kliknij **Zainstaluj**.
5. Kliknij **Włącz wtyczkę**.

### Opcja B: instalacja przez FTP/SFTP
1. Skopiuj folder `dive-spots-map-plugin` do katalogu:
   - `wp-content/plugins/dive-spots-map-plugin`
2. W panelu WordPress przejdź do **Wtyczki** i aktywuj **Dive Spots World Map**.

## Konfiguracja po instalacji
1. Utwórz stronę, np. „Dodaj miejsce nurkowe” i wstaw shortcode:
   - `[dive_spot_submission_form]`
2. Utwórz stronę, np. „Mapa nurkowisk” i wstaw shortcode:
   - `[dive_spots_map]`
3. Upewnij się, że użytkownicy muszą się logować, aby wysyłać zgłoszenia.
4. Moderuj zgłoszenia w panelu:
   - **Miejsca nurkowe** → zmień status wpisu z `pending` na `publish`, aby pojawił się na mapie.



## Automatyczna aktualizacja przez FTP
Tak — możesz aktualizować plugin automatycznie przez FTP/SFTP skryptem `deploy-ftp.sh`.

### 1) Wymagania
- narzędzie `lftp` na maszynie, z której robisz deploy
- konto FTP/SFTP z dostępem do katalogu:
  - `wp-content/plugins/dive-spots-map-plugin`

### 2) Uruchomienie ręczne
```bash
FTP_HOST="ftp.twojadomena.pl" \
FTP_USER="twoj_user" \
FTP_PASS="twoje_haslo" \
FTP_REMOTE_PATH="/public_html/wp-content/plugins/dive-spots-map-plugin" \
FTP_PROTOCOL="ftp" \
bash wordpress-plugin/dive-spots-map-plugin/deploy-ftp.sh
```

Dla SFTP ustaw `FTP_PROTOCOL="sftp"`.

### 3) Co robi skrypt
- łączy się z serwerem,
- tworzy katalog pluginu jeśli nie istnieje,
- synchronizuje pliki z lokalnego folderu pluginu na serwer,
- usuwa zdalne pliki, których nie ma lokalnie (`--delete`),
- pomija artefakty (`dist`, `*.zip`, `.git*`, `*.md`).

### 4) Automatyzacja (cron / CI)
Możesz odpalać ten skrypt z crona lub pipeline CI po każdym merge do brancha produkcyjnego.

## Główna strona pluginu (1 shortcode)
Jeśli chcesz mieć jedną „główną stronę pluginu” (mapa + najnowsze miejsca + link do formularza), użyj shortcode:

`[dive_spots_home]`

Parametry opcjonalne:
- `title` – nagłówek sekcji
- `latest_limit` – ile pozycji pokazać na liście (1–24)
- `show_form_link` – `yes` / `no`
- `form_page_url` – własny URL do strony z formularzem

Przykład:

`[dive_spots_home title="Nurkowiska świata" latest_limit="8" show_form_link="yes" form_page_url="https://twojadomena.pl/dodaj-miejsce-nurkowe/"]`

## Jak dodać miejsca nurkowe na stronie głównej

### Najprościej (edytor Gutenberg)
1. Wejdź w **Strony → Strona główna** (lub **Wygląd → Edytor**, jeśli używasz FSE).
2. Dodaj blok **Krótki kod (Shortcode)**.
3. Wklej shortcode mapy:
   - `[dive_spots_map]`
4. (Opcjonalnie) Dodaj drugi blok Shortcode z listą najnowszych miejsc:
   - `[dive_spots_latest limit="6" title="Najnowsze nurkowiska"]`
5. Zapisz stronę.

### Gdy strona główna to plik motywu (`front-page.php`)
Wstaw w szablonie:

```php
<?php echo do_shortcode('[dive_spots_map]'); ?>
<?php echo do_shortcode('[dive_spots_latest limit="6"]'); ?>
```

## Edycja przez użytkownika
Aby edytować własne miejsce przez frontend, użyj adresu strony z formularzem z parametrem:

`?edit_dive_spot=ID_WPISU`

Po zapisie wpis wraca do kolejki moderacji (`pending`).


## Brak miejsc nurkowych — jak dodać pierwsze
Jeżeli widzisz komunikat „Brak opublikowanych miejsc nurkowych”, wykonaj te kroki:

1. Utwórz stronę z formularzem i shortcode:
   - `[dive_spot_submission_form]`
2. Zaloguj się jako użytkownik.
3. Wejdź na stronę formularza i dodaj nowe miejsce (nazwa, opis, lat/lng, zdjęcia).
4. W panelu admina przejdź do **Miejsca nurkowe**.
5. Otwórz zgłoszenie i zmień status z `pending` na `publish`.
6. Odśwież stronę z mapą/listą — miejsce powinno się pojawić.

Uwaga: dopóki wpis ma status `pending`, nie będzie widoczny publicznie na mapie i liście.

## Dodatkowe wskazówki
- Jeśli mapa nie pokazuje punktów, sprawdź czy wpisy mają status `publish` i poprawne współrzędne lat/lng.
- Jeśli endpoint nie działa, odśwież bezpośrednie odnośniki: **Ustawienia → Bezpośrednie odnośniki → Zapisz zmiany**.
