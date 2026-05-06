<!DOCTYPE html>
    <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to ensure light mode is the default --}}
        <script>
            (function() {
                const appearance = localStorage.getItem('appearance') || 'light';
                if (appearance === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            })();
        </script>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

        @php
            $themeColor = \App\Models\Setting::first()?->theme_color ?? 'zinc';
            $themes = [
                'zinc'   => ['light' => '0.205 0 0', 'dark' => '0.985 0 0'],
                'slate'  => ['light' => '0.208 0.042 265.755', 'dark' => '0.984 0.003 247.858'],
                'stone'  => ['light' => '0.21 0.006 285.885', 'dark' => '0.985 0.001 106.423'],
                'red'    => ['light' => '0.577 0.245 27.325', 'dark' => '0.637 0.237 25.331'],
                'rose'   => ['light' => '0.567 0.233 13.042', 'dark' => '0.637 0.237 25.331'],
                'orange' => ['light' => '0.648 0.2 46.452', 'dark' => '0.706 0.17 46.452'],
                'green'  => ['light' => '0.527 0.154 150.069', 'dark' => '0.627 0.194 149.215'],
                'blue'   => ['light' => '0.546 0.245 262.881', 'dark' => '0.588 0.253 259.691'],
                'violet' => ['light' => '0.488 0.243 264.376', 'dark' => '0.588 0.253 259.691'],
            ];
            $currentTheme = $themes[$themeColor] ?? $themes['zinc'];
        @endphp

        <style>
            :root {
                --primary: oklch({{ $currentTheme['light'] }}) !important;
                --sidebar-primary: oklch({{ $currentTheme['light'] }}) !important;
                --sidebar-primary-foreground: oklch(0.985 0 0) !important;
            }

            .dark {
                --primary: oklch({{ $currentTheme['dark'] }}) !important;
                --sidebar-primary: oklch({{ $currentTheme['dark'] }}) !important;
                --sidebar-primary-foreground: oklch(0.205 0 0) !important;
            }

            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
