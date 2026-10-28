# EnglishFlow

Aplikacja do codziennej nauki angielskiego, z oryginalnym Oxfordem wewnątrz i synchronizacją Supabase po zalogowaniu.

## Uruchomienie

Node 24+, bez zależności: npm run dev, npm run check, npm test.

## Funkcje

- Plan 5–180 minut i ręczna checklista. Krótkie sesje: słówka + Busuu.
- Oxford: 3805 rekordów, sześć trybów, oryginalne nagrania i postępy. Dane pobierane z dotychczasowego Oxforda.
- 27 lekcji gramatyki, tabele wszystkich osób, 12 scenariuszy życiowych, 102 materiały.
- Pięć dodatkowych lekcji komunikacyjnych od podstaw po B2. Bez testu startowego; poziom wybiera uczeń według Busuu.
- Autorskie teksty do słuchania przez syntezator, pytania z kluczem, krótkie sprawdziany konstrukcji i samoocena umiejętności. To praktyka uzupełniająca, nie certyfikacja CEFR.
- Zeszyt własnych poprawek i odtwarzanie zdań z pamięci: po sukcesie 1, 3, 7, 14, 30 dni; po pomyłce 10 minut.
- Dziennik i zadania mówione/pisemne z instrukcją do zewnętrznego nauczyciela. Brak automatycznej oceny otwartych wypowiedzi.
- IndexedDB, PWA, tryb ciemny, eksport i import.

## Synchronizacja i prywatność

Publiczna strona nie zawiera osobistych adresów czatów. Publiczny klucz Supabase nie jest kluczem administracyjnym. Tabele chroni RLS według auth.uid(); schemat w docs/supabase.sql.

Na zalogowanym urządzeniu ustaw hasło do konta. Na pozostałych urządzeniach i w aplikacji z ekranu głównego zaloguj się tym samym e-mailem i hasłem. Link e-mail pozostaje opcją zapasową. Logowanie hasłem nie wysyła wiadomości. Synchronizowane są słówka, ustawienia, szkice, historia, ulubione, ścieżka i zeszyt poprawek. Nie wykonano jeszcze testu na dwóch fizycznych, zalogowanych urządzeniach użytkownika.

Prywatne skróty są osobnym dokumentem konta. Pobierane po zalogowaniu, nie trafiają do publicznego kodu, zwykłego stanu offline ani eksportu JSON. Wylogowanie usuwa ich pamięciowy podgląd. Link udostępniania ChatGPT nie staje się prywatny po zapisaniu skrótu; aplikacja odrzuca takie adresy.

## Granice

Nie jest to kompletny certyfikowany kurs ani gwarancja osiągnięcia B2 w 12 tygodni. Busuu pozostaje zewnętrznym kursem, jego postęp potwierdza uczeń. BBC i inne materiały mają niezależną dostępność. Brak kopiowania cudzych transkrypcji, nagrań i certyfikatów. Syntezator wymaga dostępnego głosu na urządzeniu.

GitHub Actions sprawdza składnię i testy oraz publikuje Pages.

## Konto

Widoczny status pokazuje potwierdzony e-mail, synchronizację i tryb offline. Każda przeglądarka i aplikacja z ekranu głównego ma własną sesję. Hasła nie trafiają do IndexedDB, dokumentów synchronizacji ani kopii danych. Przesyłane są bezpośrednio do Supabase Auth. Lokalny zapis jest przypisany do zweryfikowanego identyfikatora konta, aby nie wysyłać postępów pod inne konto. Odświeżanie sesji korzysta z blokady między kartami, gdy przeglądarka ją udostępnia.
