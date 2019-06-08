$(document).ready(function(){
    // CANVAS:
    // Se inicia el canvas:
    var ctx_izq = iniciaCanvas("#canvas_izq"); 
    var ctx_der = iniciaCanvas("#canvas_der"); 
    // Comprobamos el contexto
    if (ctx_izq || ctx_der) { 
        // Si todo es ok => Empezamos a dibujar:
        dibujaCanvas(ctx_izq, ctx_der) ;
    }
    // IMÁGENES:
    // Reproductor de imágenes:
    modoinicio();
    disparadores();
    
});

    //******************************************************************************************* Canvas */
    /** Iniciamos los objetos canvas por medio de esta función: */
    function iniciaCanvas(idCanvas) {
        var elemento = document.querySelector(idCanvas);
        if (elemento && elemento.getContext) {
            var contexto = elemento.getContext('2d');
            if (contexto) {
                return contexto;
            }
        }
        return false;
    }

    // ***********************   Función para dibujar el Canvas:
    function dibujaCanvas(ctx_izq, ctx_der) {
        var texto_izq = "<";
        var texto_der = ">";
        // Botón de la izquierda:
        ctx_izq.textAlign="center";
        ctx_izq.font="bold 70px arial";
        ctx_izq.fillStyle="#a06d1a";
        ctx_izq.fillText(texto_izq,40,100);
        ctx_izq.strokeText(texto_izq,40,100);
        // Botón de la derecha:
        ctx_der.textAlign="center";
        ctx_der.font="bold 70px arial";
        ctx_der.fillStyle="#a06d1a";
        ctx_der.fillText(texto_der,40,100);
        ctx_der.strokeText(texto_der,40,100);
    }

    //********************************************************************************************* Reproductor de imágenes */
    /** Método de inicio: */
    function modoinicio(){
        // Imágenes de Familias:
        $('#francia').css('background-image', 'url(./imagenes/francia/img0.jpg');
        $('#marruecos').css('background-image', 'url(./imagenes/marruecos/img0.jpg');
        // Miniaturas:
        miniaturas();
        // Imagen central:
        imagenCentral(1);   
    }

    /** Método para controlar los reseteos */
    function reset(){
        // Panel de datos:
        $(".datos").show();
        // Botones:
        $("#btn_filtros").hide();
        // Deslizador:
        $("#escena_deslizador").val('50');
        // Combobox:
        $("#cb_filtros").val('0');
        // Filtros:
        meteFiltros();
    }

    /** Este método es llamado cada vez que hay un cambio de familias de fotos (francia o marruecos) */
    function miniaturas(){
        var lug = 'marruecos'; // Variable para tomar una familia de fotos o otras
        if($("#francia").hasClass('active')){ // Si la familia seleccionada es Francia...
            lug = 'francia';
        }
        var count = 1;
        $("#sur div").each(function(){ // Poblamos los div de #sur con las imágenes...
            $(this).css('background-image', 'url(./imagenes/'+lug+'/img'+count+'.jpg');
            $(this).attr('data-mini', count); // Aplicamos un valor para recuperar después para mostrar la info de la foto.
            count++;
        });
        // Anulamos la imagen activa si la hay de una anterior ejecución y ponemos como activa la primera del primer div:
        $("#sur div").each(function(){
            $(this).removeClass('active');
        });
        $("#sur div:nth-child(1)").addClass('active'); // Activamos el primer div de #sur
    }

    /** Edita la imagen central el argumento es el índice del div que ocupa la miniatura elegida */
    function imagenCentral(indice){
        reset(); // Se resetean valores
        var lug = 'marruecos'; // Variable para tomar una familia de fotos o otras
        if($("#francia").hasClass('active')){ // Si la familia seleccionada es Francia...
            lug = 'francia'; 
        }
        // Imagen central:
        // Se carga la imagen:
        $("#escena_foto").hide(); // Primero quitamos la foto para realizar un fadein:
        $("#escena_foto").css('background-image', 'url(./imagenes/'+lug+'/img'+indice+'.jpg').fadeIn(1500); // Segundo se carga la img
        // Datos: Se establece la información en el panel 'Miniatura seleccionada:'
        $(".datos p:nth-child(2)").html('Número: ').append($('#sur div.active').data('mini')); 
        $(".datos p:nth-child(3)").html('Nombre: ').append('./imagenes/'+lug+'/img'+indice+'.jpg');
        $(".datos p:nth-child(4)").html('Ancho: ').append($("#escena_foto").width()).append(' px, Alto: ').append($("#escena_foto").height()).append(' px.');
    }

    /** Controla la edición de filtros. He añadido dos filtros más que utilizan escalas diferentes */
    function meteFiltros(){
        if($('#cb_filtros option:selected') .val()!='0'){
            switch ($('#cb_filtros option:selected') .val()) {
                case 'blur': // Caso especial de filtro escala de 0 a 10:
                    $(".filtros p:nth-child(3)").html('Nivel de ').append($('#cb_filtros option:selected').text()).append(": ").append($('#escena_deslizador').val()/10).append(" px."); 
                    var valor = $('#cb_filtros option:selected') .val()+'('+$('#escena_deslizador').val()/10+'px)';
                    break;
                case 'hue-rotate': // Caso especial de filtro escala de 0 a 360:
                    $(".filtros p:nth-child(3)").html('Nivel de ').append($('#cb_filtros option:selected').text()).append(": ").append(($('#escena_deslizador').val()/10*36).toFixed(2)).append(" Deg."); 
                    var valor = $('#cb_filtros option:selected') .val()+'('+$('#escena_deslizador').val()/10*36+'deg)';
                    break;
                default: // Filtros normales de escala 0 a 1
                    $(".filtros p:nth-child(3)").html('Nivel de ').append($('#cb_filtros option:selected').text()).append(": ").append($('#escena_deslizador').val()).append(" %."); 
                    var valor = $('#cb_filtros option:selected') .val()+'('+$('#escena_deslizador').val()/100+')';
                    break;
            }
            $("#escena_foto").css('filter', valor);
        } else { // Sin filtros a aplicar:
            $(".filtros p:nth-child(3)").html('<span style="color:#a06d1a">La imagen no tiene aplicado ningún filtro.</span>'); 
            $("#escena_foto").css('filter', 'none');
        }
        
    }

    /** Esta función controla los click y los cambios de estados de los elementos para interactuar usuario y aplicación */
    function disparadores(){
        // Eventos Por Click:
        /** Botón de familia Francia */
        $("#marruecos").click(function(){
            $("#francia").removeClass('active');
            $("#marruecos").addClass('active');
            miniaturas();
            imagenCentral(1);
        });
        /** Botón de familia Marruecos */
        $("#francia").click(function(){
            $("#marruecos").removeClass('active');
            $("#francia").addClass('active');
            miniaturas();
            imagenCentral(1);
        });
        /** Botones de miniaturas */
        $("#sur div").click(function(){
            // Anulamos la imagen activa para poner la nueva que se acaba de marcar:
            $("#sur div").each(function(){
                $(this).removeClass('active');
            });
            // Imagen presionada:
            $(this).addClass('active');
            // Se llama a la Imagen central correspondiente:
            imagenCentral($(this).index()+1);
        });
        /** Botón de Ocultar detalles: */
        $("#btn_datos").click(function(){
            $(".datos").hide();
            $("#btn_filtros").show();
        });
        /** Botón de Mostrar detalles */
        $("#btn_filtros").click(function(){
            $(".datos").show();
            $("#btn_filtros").hide();
        });
        /** Botón creado en canvas de la izquierda: pone el valor del filtro a cero */
        $("#canvas_izq").click(function(){
            $("#escena_deslizador").val('0');
            meteFiltros();
        });
        /** Botón creado en canvas de la derecha: pone el valor del filtro a 100 */
        $("#canvas_der").click(function(){
            $("#escena_deslizador").val('100');
            meteFiltros();
        });

        // Eventos Por Cambio:
        /** Cada vez que cambia el valor del deslizador */
        $("#escena_deslizador").change(function () {
            meteFiltros();
        });
        /** Cada vez que cambia el valor del combo de Filtros */
        $("#cb_filtros").change(function () {
            $("#escena_deslizador").val('50');
            meteFiltros();
        });

    }



    // Fuentes consultadas:
    // https://www.anerbarrena.com/jquery-each-5297/
    // https://www.bufa.es/
    // https://www.bufa.es/jquery-averiguar-numero-indice/
    // https://openclassrooms.com/en/courses/3693206-introduccion-a-jquery/3693271-selecciona-elementos
    // http://www.linuxhispano.net/2012/04/09/manejo-de-listas-select-con-jquery-comboboxdropdownlist/
    // https://www.anerbarrena.com/html5-range-input-1694/
    // https://blog.endeos.com/8-filtros-css-para-imagenes-que-todo-disenador-web-deberia-conocer/
    // https://www.anerbarrena.com/jquery-fadein-y-fadeout-3114/
    