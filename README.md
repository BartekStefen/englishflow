# EnglishFlow

Osobna aplikacja do codziennej nauki angielskiego. Oryginalny Oxford 3000 pozostaje na https://bartekstefen.github.io/oxford3000-nauka/ — wszystkie pliki, nagrania i postępy pozostają bez zmian.

Nowa strona: https://bartekstefen.github.io/englishflow/

## Uruchomienie

Node 24+, bez instalowania zależności:

```
npm run dev
npm run check
npm test
```

## Funkcje

- Plan dnia 5–180 minut, dobierany do historii i błędów. Zachowanie ukończonych zadań po zmianie czasu.
- 27 lekcji gramatycznych A1–B2: zastosowanie, konstrukcje, przykłady z tłumaczeniem, błędy, quiz, wpisywanie i własna wypowiedź.
- Cała biblioteka z poprzedniego kodu: 60 pozycji w 12 tygodniach i 19 dodatkowych źródeł; wyszukiwanie, filtry, ulubione, ćwiczenia.
- Speaking z instrukcją dla ChatGPT/Gemini, zapisanym nauczycielem i refleksją po rozmowie.
- Busuu: ręczne potwierdzenie, temat i praktyka w trzech własnych zdaniach.
- Dziennik, dwa autorskie teksty reading z quizami, historia i statystyki rzeczywistych sesji.
- IndexedDB, szkice, import historii bez dublowania, pełny eksport, PWA, aktualizacje i tryb ciemny.
- Opcjonalne logowanie e-mail i synchronizacja niezmiennej historii sesji przez Supabase.

## Supabase — konfiguracja opcjonalna

Bez konfiguracji działa tryb lokalny. Aby synchronizować historię pomiędzy iPhonem i komputerem:

1. Utwórz własny projekt Supabase i uruchom `docs/supabase.sql` w SQL Editor.
2. W Authentication włącz Email. Ustaw Site URL i Redirect URLs na adres wdrożonego EnglishFlow.
3. W ustawieniach EnglishFlow wpisz Project URL i publiczny publishable/anon key. Nigdy service_role ani sb_secret.
4. Podaj e-mail i zaloguj się otrzymanym linkiem. Powtórz na drugim urządzeniu.
5. Użyj „Synchronizuj historię”. Przesyłane są wyłącznie niezmienne sesje; UUID zapewniają idempotentne ponowienia. RLS ogranicza odczyt i zapis do właściciela.

Ustawienia, szkice i ulubione pozostają lokalne; pełny eksport obejmuje je, ale import łączy wyłącznie historię. Konto Supabase wymaga konfiguracji przez właściciela, nie jest aktywowane automatycznie.

## Granice i materiały

Oxford zachowuje swój oryginalny algorytm powtórek. EnglishFlow nie zastępuje go FSRS ani nie publikuje kopii słownictwa/nagrań. Linki materiałów są odziedziczone i oznaczone jako takie; ich dostępność nie jest gwarantowana. Nie publikujemy cudzych transkrypcji. Otwarte odpowiedzi nie są oceniane automatycznie; wyniki procentowe dotyczą tylko pytań z kluczem. Czasy sesji potwierdza użytkownik.

Audyt: `docs/AUDIT.md`. Podstawa dydaktyczna: `docs/research.md`. Brak deklaracji otwartej licencji na odziedziczone opisy i metadane.

## Wdrożenie

GitHub Actions weryfikuje składnię i testy oraz publikuje pliki na Pages. SW stosuje network-first dla zasobów aplikacji i komunikat przed aktywacją nowej wersji. Cache ma własny prefiks EnglishFlow. Materiały zewnętrzne wymagają sieci.
