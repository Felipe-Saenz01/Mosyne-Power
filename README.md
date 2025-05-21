<h1 align="center" >Mosyne Power - Unitropico</h1></br>
<p align="center"><a href="https://unitropico.edu.co" target="_blank"><img src="https://i.postimg.cc/GtJMcSLD/LOGO-1024x601.png" width=50% alt="Unitropico Logo"></a><a href="https://laravel.com" target="_blank"><img width=50% src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg"  alt="Laravel Logo"></a></p></br>
<p>Este aplicativo tiene como objetivo utilizar las técnicas de estudio de <strong>Repaso espaciado</strong> y <strong>Cajas de Leitner</strong> para aumentar la curva de olvido de los conceptos que deseamos mantener en nuestra memoria, con diferentes fines como aprendizaje de idiomas, estudio de conceptos para la universidad, entre otros.

## Requisitos

El aplicativo está desarrollado usando el framework de php Laravel en su versión 12, cuyos requisitos mínimos son:
- PHP >= 8.2
- Composer
- MySQL
- Node

## Instalación

1. Clonar repositorio:
```Git
git clone git@github.com:Felipe-Saenz01/Procesos-investigativos.git
cd Procesos-investigativos
```

2. Instalar dependencias de composer:
```
composer install
```

3. Instalar dependencias de node:
```
npm install
```

4. crear archivo .env y .env.example para la configuración del proyecto:
```
cp .env.example .env
```

5. Generar clave para la aplicacion:
```
php artisan key:generate
```

6. Migrar bases de datos. (es necesario incluir datos correspondientes de la base de datos en el archivo .env):
```
php artisan migrate
```

7. Inciar servidor local:
```
composer run dev
```