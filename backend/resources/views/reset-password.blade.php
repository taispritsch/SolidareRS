<!DOCTYPE html>
<html>

<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        .card {
            background: #FFFFFF;
            border: #133567 solid 1px;
            border-radius: 16px;
            height: 1000px;
            font-family: "Barlow", sans-serif;
        }

        .header {
            height: 215px;
            background-color: #133567;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            border: #133567 solid 1px;
        }

        .header-content {
            margin-left: 40px;
            height: 100%;
            display: flex;
            align-items: center;
        }

        img {
            margin-left: 10px;
            margin-right: 10px;
        }

        .header-title {
            font-weight: 600;
            font-size: 36px;
            color: #FFFFFF;
            margin: 0px;
            height: 100%;
            display: flex;
            align-items: center;
            margin-left: 10px;
        }

        .body {
            margin: 115px 60px 0 60px;
        }

        .body-title {
            font-size: 22px;
            font-weight: 600;
            color: #202020;
            margin-left: 30px;
        }

        .body-message {
            font-size: 20px;
            font-weight: 500;
            color: #202020;
            line-height: 1.5;
        }

        .greeting {
            font-size: 20px;
            font-weight: 500;
            color: #202020;
            margin-top: 60px;
        }



        @media only screen and (max-width: 600px) {
            .card {
                background: #FFFFFF;
                border: #133567 solid 1px;
                border-radius: 16px;
                height: 1000px;
                font-family: "Barlow", sans-serif;
            }

            .header {
                height: 125px;
                background-color: #133567;
                border-top-left-radius: 16px;
                border-top-right-radius: 16px;
                border: #133567 solid 1px;
            }

            .header-content {
                margin-left: 10px;
                height: 100%;
                display: flex;
                align-items: center;
            }

            img {
                margin-left: 10px;
                margin-right: 10px;
            }

            .header-title {
                font-weight: 600;
                font-size: 26px;
                color: #FFFFFF;
                margin: 0px;
                height: 100%;
                display: flex;
                align-items: center;
            }

            .body {
                margin: 40px 20px 0 20px;
            }

            .body-title {
                font-size: 20px;
                font-weight: 600;
                color: #202020;
                margin-left: 30px;
            }

            .body-message {
                font-size: 18px;
                font-weight: 500;
                color: #202020;
                line-height: 1.5;
            }

            .greeting {
                margin-top: 20px;
                font-size: 18px;
                font-weight: 500;
                color: #202020;
            }
        }
    </style>
</head>

<body class="card">
    <header class="header">
        <div class="header-content">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/maos-segurando-coracao.png'))) }}" alt="SolidareRS" width="50" height="50">
            <h1 class="header-title"> SolidareRS</h1>
        </div>
    </header>

    <div class="body">
        <p class="body-title"> Olá, {{ $user->name }}</p>

        <div class="body-message">

            <p> Sua senha foi redefinida com sucesso. </p>
            <p> Caso não tenha sido você, altere sua senha o mais rápido possível. </p>

        </div>

        <div class=greeting>
            <p>Atenciosamente,</p>
            <p>Equipe da SolidareRS</p>
        </div>
    </div>
</body>

</html>