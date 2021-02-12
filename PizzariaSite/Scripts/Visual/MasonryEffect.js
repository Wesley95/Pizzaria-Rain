(function (e) {
    e.fn.MasonryEffect = function (v) {

        var settings = {
            masonryParentClass: ".ul-masonry-container",
            endMainSpace: 100,
            autoParentHeight: true,
            spaceBetween: 20,
            spaceTop: 20,
            initSpaceTop: 20,
            movementVelocity: 300,
            resizable: false,
            move: function () { },
            setParentHeight: function () { }
        }

        if (arguments.length > 0 && typeof arguments[0] == "object")
            this.each(function () { this.options = e.extend(settings, v); })
        else
            this.each(function () { this.options = settings; })

        var $this = $(this),
            f = function () {
                $this.each(function () {
                    var t = this,
                        main_container = $(t).parents(t.options.masonryParentClass),//$(".request-container"); Container líder, onde dou o resize, pois as divs são position absolute e não é possível resize automático
                        request_width = $(t).innerWidth(),//Capturo a largura de uma da div, sendo que todas sem a mesma largura, em tese
                        count_by_row,//Variavel local para guardar a quantidade de itens por linha
                        space_between,
                        space_around;

                    //CASO UTILIZEMOS O TIPO DE EFEITO BASEADO NO PNGTREE, COM AUTOSIZE UTILIZANDO OBJECT-FIT
                    if (t.options.resizable) {
                        //console.log("Aqui");
                        //CAPTURAMOS A QUANTIDADE BASEADO NA LARGURA DO PARENT / LARGURA DO ITEM (SABENDO QUE TODOS TEM O MESMO TAMANHO)
                        count_by_row = Math.floor(main_container.innerWidth() / request_width);
                        //CASO A QUANTIDADE DE ITENS POR LINHA SEJA 1, COLOCAMOS 2. CASO CONTRÁRIO, CONTINUA O VALOR QUE HÁ.
                        count_by_row = count_by_row === 1 ? 2 : count_by_row;
                        //O ESPAÇO ENTRE CADA ITEM É MEDIDO CAPTURANDO A LARGURA DO PARENT MOD A LARGURA DO ITEM, DIVIDIDO PELA
                        //QUANTIDADE DE ITENS POR LINHA -1
                        space_between = Math.floor(main_container.innerWidth() % request_width) / (count_by_row - 1)
                    }
                    //CASO UTILIZEMOS O TIPO DE EFEITO BASEADO NO PINTEREST, SEM AUTOSIZE E COM O CONTAINER MANTENDO O MESMO TAMANHO SEMPRE
                    else {
                        //UTILIZAMOS O SPACE_BETWEEN PASSADO NO OBJ
                        space_between = t.options.spaceBetween;
                        //A QUANTIDADE DE ITENS QUE CABEM POR LINHA CALCULAMOS 
                        count_by_row = Math.floor(100 / ((request_width + space_between) / main_container.width() * 100));
                        //CASO A QUANTIDADE DE ITENS POR LINHA SEJA 1, MANTEMOS COMO 2.
                        count_by_row = count_by_row === 1 ? 2 : count_by_row;
                        //SPACE_AROUND REPRESENTA A QUANTIDADE DE ESPAÇO QUE DEIXAREMOS ANTES E DEPOIS DOS ITENS
                        space_around = (main_container.width() - ((space_between * (count_by_row - 1)) + (request_width * count_by_row))) / 2;
                    }

                    //CAPTURAMOS O INDEX DO ITEM, INICIANDO EM 0
                    var index = $(t).index(),
                        column = ((1 + index) % count_by_row),//VERIFICAMOS EM QUAL COLUNA O ITEM SE LOCALIZA
                        x = column == 0 ? count_by_row : column,//CASO COLUMN SEJA IGUAL A 0, SABEMOS QUE O CALCULO FOI PERFEITO ENTÃO, O VALOR DA COLUNA É A QUANTIDADE DE ITENS POR LINHA.
                        top = t.options.initSpaceTop,//TOP REPRESENTA O ESPAÇO  DO TOPO, INICIALIZANDO COM O VALOR DE SPACE_BETWEEN
                        left = count_by_row == 1 ? 0 : (space_between + request_width) * (x - 1);//LEFT REPRESENTA A POSIÇÃO HORIZONTAL ONDE O OBJETO IRÁ
                    left += t.options.resizable ? 0 : space_around;

                    //VERIFICAMOS SE O ITEM ESTÁ IGUAL OU ACIMA DA PRIMEIRA COLUNA
                    if (index >= count_by_row) {

                        for (var l = index - count_by_row; l >= 0; l -= count_by_row) {
                            top += $this.eq(l).innerHeight() + t.options.spaceTop;
                        }
                    }

                    t.move = function () {
                        $(t).animate({
                            left: left + "px",
                            top: top + "px"
                        }, t.options.movementVelocity);
                    }

                    t.setParentHeight = function () {

                        if (t.options.autoParentHeight && index == $this.length - 1) {
                            var last_line_object = Math.floor($this.length / count_by_row) * count_by_row,//Captura o primeiro objeto da ultima linha
                                aux = 0,
                                main_height = 0;

                            last_line_object = last_line_object % count_by_row == 0 ? last_line_object - count_by_row : last_line_object;


                            for (var l = last_line_object; l < $this.length; l++) {
                                aux = 0;

                                for (var c = l; c >= 0; c -= count_by_row) {
                                    aux += $this.eq(c).innerHeight() + t.options.spaceTop;
                                }

                                main_height = aux > main_height ? aux : main_height;
                            }

                            main_height += t.options.spaceTop + t.options.endMainSpace;

                            main_container.css("height", main_height + "px");
                        }
                    }

                    t.move(top, left);
                    t.setParentHeight();
                })
            }
        setTimeout(function () {
            f();
        }, 400);

        /*Verificação de tempo de redimensionamento*/
        var rtime,
            timeout = false,
            delta = 400;

        $(window).resize(function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(resizeend, delta);
            }
        });

        function resizeend() {
            if (new Date() - rtime < delta) {
                setTimeout(resizeend, delta);
            } else {
                timeout = false;
                f();
            }
        }
    }
}(jQuery));

$(".li-item-masonry").MasonryEffect({
    masonryParentClass: ".ul-masonry-container",
    movementVelocity: 600,
    resizable: true
});