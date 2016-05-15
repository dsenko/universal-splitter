var $universalSplitter = {

    init: function(){

        if(!this.initialized){

            var dragEnd = function(e){
                e.preventDefault();

                $universalSplitter.current = null;
                $universalSplitter.currentOptions = null;
                $universalSplitter.lastX = null;
                $universalSplitter.lastY = null;

                console.log('dragEnd');
            };

            var dragMove = function(e){
                e.preventDefault();

                if($universalSplitter.current && $universalSplitter.currentOptions){

                    if($universalSplitter.currentOptions.vertical){

                        var currentX = e.x;

                        if($universalSplitter.lastX == null){
                            $universalSplitter.lastX = currentX;
                        }

                      //  console.log('x: '+currentX+' y: '+currentY);

                        var delta = $universalSplitter.lastX-currentX;
                        var firstWidth = $universalSplitter.currentOptions.first.outerWidth();
                        var secondWidth = $universalSplitter.currentOptions.second.outerWidth();

                        if(currentX > $universalSplitter.lastX){
                           // console.log('right');

                            firstWidth = firstWidth+Math.abs(delta);
                            secondWidth = secondWidth+delta;

                        }else{
                            console.log('left');

                            firstWidth = firstWidth-Math.abs(delta);
                            secondWidth = secondWidth+Math.abs(delta);

                        }

                        if(firstWidth >= $universalSplitter.currentOptions.firstMinWidth
                            && secondWidth >= $universalSplitter.currentOptions.secondMinWidth
                        ){
                            console.log('sett');
                            $universalSplitter.currentOptions.first.css('width', firstWidth+'px');
                            $universalSplitter.currentOptions.second.css('width', secondWidth+'px');

                            if($universalSplitter.currentOptions.absolute){
                                $universalSplitter.current.css('margin-left', firstWidth+'px');
                            }
                        }

                        $universalSplitter.lastX = currentX;

                        if($universalSplitter.currentOptions.adjustSplitterHeight){
                            var maxHeight = Math.max($universalSplitter.currentOptions.first.outerHeight(), $universalSplitter.currentOptions.second.outerHeight());
                            $universalSplitter.current.css('height', maxHeight+'px');
                        }

                    }

                    if($universalSplitter.currentOptions.horizontal){

                        var currentY = e.y;

                        if($universalSplitter.lastY == null){
                            $universalSplitter.lastY = currentY;
                        }

                        var delta = Math.abs($universalSplitter.lastY-currentY);
                        var firstHeight = $universalSplitter.currentOptions.first.outerHeight();
                        var secondHeight = $universalSplitter.currentOptions.second.outerHeight();

                        if(currentY > $universalSplitter.lastY){
                            //console.log('down');

                            firstHeight = firstHeight+delta;
                            secondHeight = secondHeight-delta;

                        }else{
                            //console.log('up');
                            firstHeight = firstHeight-delta;
                            secondHeight = secondHeight+delta;
                        }

                        var sumHeight = firstHeight+secondHeight;
                        var parentHeight = $universalSplitter.currentOptions.parentHeight;
                        console.log(sumHeight+' = '+parentHeight);

                        if(firstHeight >= $universalSplitter.currentOptions.firstMinHeight
                            && secondHeight >= $universalSplitter.currentOptions.secondMinHeight
                        && sumHeight == parentHeight){
                            $universalSplitter.currentOptions.first.css('height', firstHeight+'px');
                            $universalSplitter.currentOptions.second.css('height', secondHeight+'px');
                        }

                        $universalSplitter.lastY = currentY;

                    }


                }

            };

            window.addEventListener("mousemove", function(e) {dragMove(e);});
            window.addEventListener("touchmove", function(e) {dragMove(e);});
            window.addEventListener("mouseup", dragEnd);
            window.addEventListener("mouseleave", dragEnd);
            window.addEventListener("touchend", dragEnd);

            this.initialized = true;

        }

    },

    split: function(options){

        if(!this.initialized){
            this.init();
        }

        if(!options.firstMinWidth){
            options.firstMinWidth = 0;
        }
        if(!options.secondMinWidth){
            options.secondMinWidth = 0;
        }

        options.first = $(options.first);
        options.second = $(options.second);

        if(options.addOverflow){

            if(options.vertical){
                options.first.css('overflow-x', 'hidden');
                options.second.css('overflow-x', 'hidden');
            }else{
                options.first.css('overflow-y', 'hidden');
                options.second.css('overflow-y', 'hidden');
            }

        }

        if(!options.parent){
            options.parent = options.first.parent();
            options.parentWidth =  options.parent.width();
            options.parentHeight = options.parent.outerHeight();
            if(options.parentWidth < (options.first.width()+options.second.width())){
                options.parentWidth = options.first.width()+options.second.width();
            }

            if(options.parentHeight < (options.first.outerHeight()+options.second.outerHeight())){
                options.parentHeight = options.first.outerHeight()+options.second.outerHeight();
            }
        }

        options.splitterHeightPx = null;


        if(options.vertical){

            if(options.splitterHeight == 'OUTER'){
                options.splitterHeightPx = $(options.parent).outerHeight();
            }else {
                options.splitterHeightPx = $(options.parent).height();
            }


            if(options.splitterHeightPx == 0){
                if(options.splitterHeight == 'OUTER'){
                    options.splitterHeightPx = Math.max(options.first.outerHeight(), options.second.outerHeight());
                }else {
                    options.splitterHeightPx = Math.max(options.first.height(), options.second.height());
                }
            }
        }

        if(options.horizontal){

            if(!options.splitterHeight){
                options.splitterHeight = 10;
            }

            options.splitterHeightPx =  options.splitterHeight;

        }


        if(options.vertical){
            options.splitterHtml = '<div class="splitter-vertical"></div>';

            if(options.splitterClass) {
                options.splitterHtml = '<div class="splitter-vertical '+options.splitterClass+'"></div>';
            }
        }

        if(options.horizontal){
            options.splitterHtml = '<div class="splitter-horizontal"></div>';

            if(options.splitterClass) {
                options.splitterHtml = '<div class="splitter-horizontal '+options.splitterClass+'"></div>';
            }
        }


        if(!options.splitterWidth){
            options.splitterWidth = 10;
        }

        options.splitterId = Math.random().toString(36).substring(8);

        if(options.vertical){

            if(options.absolute){

                options.marginLeft = options.first.outerWidth();

                options.splitterHtml = options.splitterHtml.replace('<div', '<div id="'+options.splitterId+'" style="margin-left: '+options.marginLeft+'px; position: relative; float: left; height: inherit; width: '+options.splitterWidth+'px !important"');
            }else{
                options.splitterHtml = options.splitterHtml.replace('<div', '<div id="'+options.splitterId+'" style="height: '+options.splitterHeightPx+'px; width: '+options.splitterWidth+'px !important"');
            }

            if(!options.initialFirstWidth){
                options.first.css('width', 'calc(50% - '+(options.splitterWidth/2)+'px)');
            }else{
                options.first.css('width', options.initialFirstWidth);
            }

            if(!options.initialSecondWidth){
                options.second.css('width', 'calc(50% - '+(options.splitterWidth/2)+'px)');
            }else{
                options.second.css('width', options.initialSecondWidth);
            }



        }

        if(options.horizontal){
            options.splitterHtml = options.splitterHtml.replace('<div', '<div id="'+options.splitterId+'" style="height: '+options.splitterHeightPx+'px;"');
        }

        options.first.after(options.splitterHtml);

        var dragStart = function(_this){

            $universalSplitter.current = _this;

            $.each($universalSplitter.options, function(i, _options){
                if(_options.splitterId == $universalSplitter.current[0].id){
                    $universalSplitter.currentOptions = _options;
                }
            });

        };

        var splitterSelector = $('#'+options.splitterId)[0];
        splitterSelector.addEventListener("mousedown", function(e) {
            e.preventDefault();
            dragStart($(this));
        });
        splitterSelector.addEventListener("touchstart", function(e) {
            e.preventDefault();
            dragStart($(this));
        });

        this.options.push(options);
    },

    initialized: false,
    current: null,
    currentOptions: null,
    options: [],
    lastX: null,
    lastY: null,

}

$(document).ready(function(){

    $universalSplitter.split({
        first: '#absolute-col-1',
        second: '#absolute-col-2',
        vertical: true,
        absolute: true,
        splitterWidth: 10,
        splitterHeight: 'OUTER',
        firstMinWidth: 100,
        secondMinWidth: 200,
        splitterClass: 'splitter-example-3',
        addOverflow: true,
        initialFirstWidth: '120px',
        initialSecondWidth: 'calc(100% - 130px)'
    });

    $universalSplitter.split({
        first: '#left-col-1',
        second: '#right-col-1',
        vertical: true,
        splitterWidth: 10,
        splitterHeight: 'OUTER',
        firstMinWidth: 220,
        secondMinWidth: 100,
        splitterClass: 'splitter-example-1',
        addOverflow: true,
        adjustSplitterHeight: true
    });

    $universalSplitter.split({
        first: '#left-col-2',
        second: '#right-col-2',
        vertical: true,
        splitterWidth: 10,
        splitterHeight: 'OUTER',
        firstMinWidth: 100,
        secondMinWidth: 200,
        splitterClass: 'splitter-example-2',
        addOverflow: true,
        adjustSplitterHeight: false
    });

    $universalSplitter.split({
        first: '#top-row-1',
        second: '#down-row-1',
        horizontal: true,
        splitterHeight: 10,
        firstMinHeight: 50,
        secondMinHeight: 50,
        splitterClass: 'col-sm-12',
        addOverflow: true
    });

});
