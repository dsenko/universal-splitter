console.log('splitter works');
var $universalSplitter = {

    initialized: false,
    current: null,
    currentOptions: null,
    options: [],
    lastX: null,
    lastY: null,


    init: function(){

        if(!$universalSplitter.initialized){

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

                    if($universalSplitter.currentOptions.onSplit !== undefined){
                        $universalSplitter.currentOptions.onSplit($universalSplitter.currentOptions);
                    }
                    if($universalSplitter.currentOptions.vertical){

                        var currentX = e.x;

                        if($universalSplitter.lastX == null){
                            $universalSplitter.lastX = currentX;
                        }

                        console.log('x: '+currentX);

                        var delta = $universalSplitter.lastX-currentX;

                        if($universalSplitter.currentOptions.delta){
                            if(Math.abs(delta) < $universalSplitter.currentOptions.delta){
                                return;
                            }
                        }else{
                            if(Math.abs(delta) < 10){
                                return;
                            }
                        }

                        $.each( $universalSplitter.options, function(i, _options){
                            if(_options.optionsId !== $universalSplitter.currentOptions.optionsId && !_options.preventRefresh){
                                console.log('changes ');
                                console.log(_options);
                                /*
                                 var parentWidth = _options.parent.width();
                                 var firstWidthPercentage = $(_options.first).width()-(_options.splitterWidth/2);
                                 console.log('firstWidthPercentage '+firstWidthPercentage);
                                 firstWidthPercentage = (100 * firstWidthPercentage)/parentWidth;
                                 var secondWidthPercentage = $(_options.second).width()-(_options.splitterWidth/2);
                                 console.log('secondWidthPercentage '+secondWidthPercentage);
                                 secondWidthPercentage = (100 * secondWidthPercentage)/parentWidth;

                                 firstWidthPercentage = Math.floor(firstWidthPercentage);
                                 secondWidthPercentage = Math.floor(secondWidthPercentage);
                                 console.log('parentWidth '+parentWidth);
                                 console.log('firstWidthPercentage '+firstWidthPercentage);
                                 console.log('secondWidthPercentage '+secondWidthPercentage);

                                 var sumPercentage = secondWidthPercentage+firstWidthPercentage;

                                 console.log('sumPercentage '+sumPercentage);

                                 if(sumPercentage < 100){
                                 secondWidthPercentage += (100-sumPercentage)-1;
                                 }
                                 $(_options.first).css('width', firstWidthPercentage+'%');
                                 $(_options.second).css('width', secondWidthPercentage+'%');
                                 */

                                $(_options.first).css('width', _options.initialFirstWidth);
                                $(_options.second).css('width', _options.initialSecondWidth);

                            }
                        });


                        var firstWidth = $universalSplitter.currentOptions.first.outerWidth();

                        if($universalSplitter.currentOptions.secondMinWidth !== 'auto'){

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

                            console.log(firstWidth+' = '+secondWidth);

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

                        }else{

                            if(currentX > $universalSplitter.lastX){
                                firstWidth = firstWidth+Math.abs(delta);
                            }else{
                                firstWidth = firstWidth-Math.abs(delta);
                            }

                            console.log('setting');
                            if(firstWidth >= $universalSplitter.currentOptions.firstMinWidth){
                                $universalSplitter.currentOptions.first.css('width', firstWidth+'px');
                                $universalSplitter.currentOptions.second.css('width', 'auto');

                                if($universalSplitter.currentOptions.absolute){
                                    $universalSplitter.current.css('margin-left', firstWidth+'px');
                                }
                            }

                        }


                        $universalSplitter.lastX = currentX;

                        if($universalSplitter.currentOptions.adjustSplitterHeight){

                            var maxHeight = 0;

                            if($universalSplitter.currentOptions.adjustSplitterHeightFromParent){
                                maxHeight = $universalSplitter.currentOptions.parent.outerHeight();
                            }else{
                                maxHeight = Math.max($universalSplitter.currentOptions.first.outerHeight(), $universalSplitter.currentOptions.second.outerHeight());
                            }

                            $universalSplitter.current.css('height', maxHeight+'px');
                        }

                    }

                    if($universalSplitter.currentOptions.horizontal){

                        /*
                         $.each( $universalSplitter.options, function(i, _options){
                         if(_options.optionsId !== $universalSplitter.currentOptions.optionsId && !_options.preventRefresh){

                         if(_options.vertical){
                         console.log('update height');
                         _options.updateSplitterHeight();
                         }
                         }
                         });
                         */

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
                        var parentHeight = $universalSplitter.currentOptions.parent.outerHeight()+$universalSplitter.currentOptions.splitterHeight;
                        console.log(sumHeight+' = '+parentHeight);

                        console.log('firstHeight '+firstHeight+' $universalSplitter.currentOptions.firstMinHeight '+$universalSplitter.currentOptions.firstMinHeight);
                        console.log('secondHeight '+secondHeight+' $universalSplitter.currentOptions.firstMinHeight '+$universalSplitter.currentOptions.secondMinHeight);
                        if(firstHeight >= $universalSplitter.currentOptions.firstMinHeight
                            && secondHeight >= $universalSplitter.currentOptions.secondMinHeight
                        ){
                            if($universalSplitter.currentOptions.preventSumHeight){
                                console.log('prevent');
                                if(sumHeight == parentHeight){
                                    $universalSplitter.currentOptions.first.css('height', firstHeight+'px');
                                    $universalSplitter.currentOptions.second.css('height', secondHeight+'px');
                                }
                            }else{
                                $universalSplitter.currentOptions.first.css('height', firstHeight+'px');
                                $universalSplitter.currentOptions.second.css('height', secondHeight+'px');
                            }

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

            $universalSplitter.initialized = true;



        }


    },

    remove: function(splitterName){

        var clearedOptions = [];
        $.each($universalSplitter.options, function(i, _options){

            if(_options.name == splitterName){
                console.log(_options.splitterId);
                $('#'+_options.splitterId).remove();
                $(_options.first)[0].style = '';
                $(_options.second)[0].style = '';
                console.log('remove mainMenuSplitter');
            }else{
                clearedOptions.push(_options);
            }

        });

        $universalSplitter.options = clearedOptions;

    },

    split: function(options){

        console.log(options);

        if(!$universalSplitter.initialized){
            $universalSplitter.init();
        }


        var clearedOptions = [];
        $.each($universalSplitter.options, function(i, _options){

            if('#'+_options.first[0].id !== options.first &&'#'+_options.second[0].id !== options.second){
                clearedOptions.push(_options);
            }else{
                $('#'+_options.splitterId).remove();
                $(_options.first)[0].style = '';
                $(_options.second)[0].style = '';
            }

        });

        $universalSplitter.options = clearedOptions;

        setTimeout(function(){


            options.optionsId = Math.random().toString(36).substring(5);

            if(options.preventSumHeight == undefined || options.preventSumHeight == null){
                options.preventSumHeight = true;
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
            }else{
                options.parent = $(options.parent);
            }

            /*
             options.parentWidth =  options.parent.width();
             options.parentHeight = options.parent.outerHeight();
             if(options.parentWidth < (options.first.width()+options.second.width())){
             options.parentWidth = options.first.width()+options.second.width();
             }

             if(options.parentHeight < (options.first.outerHeight()+options.second.outerHeight())){
             options.parentHeight = options.first.outerHeight()+options.second.outerHeight();
             }*/

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

                    if(options.splitterHeight == 'OUTER'){
                        options.splitterHtml = options.splitterHtml.replace('<div', '<div id="'+options.splitterId+'" style="margin-left: '+options.marginLeft+'px; position: relative; float: left; height: '+options.splitterHeightPx +'px; width: '+options.splitterWidth+'px !important"');
                    }else{
                        options.splitterHtml = options.splitterHtml.replace('<div', '<div id="'+options.splitterId+'" style="margin-left: '+options.marginLeft+'px; position: relative; float: left; height: '+options.splitterHeight+'; width: '+options.splitterWidth+'px !important"');
                    }


                }else{
                    options.splitterHtml = options.splitterHtml.replace('<div', '<div id="'+options.splitterId+'" style="height: '+options.splitterHeightPx+'px; width: '+options.splitterWidth+'px !important"');
                }

                if(!options.initialFirstWidth){
                    options.initialFirstWidth = 'calc(50% - '+(options.splitterWidth/2)+'px)';
                }

                options.first.css('width', options.initialFirstWidth);


                if(!options.initialSecondWidth){
                    options.initialSecondWidth = 'calc(50% - '+(options.splitterWidth/2)+'px)';
                }

                options.second.css('width', options.initialSecondWidth);




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

            console.log('x');

            var splitterSelector = $('#'+options.splitterId)[0];
            splitterSelector.addEventListener("mousedown", function(e) {
                e.preventDefault();
                dragStart($(this));
            });
            splitterSelector.addEventListener("touchstart", function(e) {
                e.preventDefault();
                dragStart($(this));
            });

            options.updateSplitterHeight = function(){

                var maxHeight = Math.max(options.first.outerHeight(), options.second.outerHeight());
                $('#'+options.splitterId).css('height', maxHeight+'px');

            }

            $universalSplitter.options.push(options);

            console.log($universalSplitter.options);

        }, $universalSplitter.options.length*100);

    },



}

/*
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

 });*/
