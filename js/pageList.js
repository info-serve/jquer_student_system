(function($){
    var obj = {
    TurnPage:function (options){
            this.wrap = options.wrap;
            this.curPage = options.curPage || 1 ;
            this.allPage = options.allPage || 1 ;
            this.changePage = options.changePage || function(){} ;
            this.createDom();
            this.bindEvent();
            this.addCss()
        },
        createDom:function (){
            this.addCss()
            $(this.wrap).empty();
            var OulStr = $('<ul class = "pageList"></ul>')
                 //  添加上一页
           if(this.curPage > 1){
               var prev = OulStr.append($('<li class = " prev-page">&lt;</li>'))
               $(this.wrap).append(prev);
           }
            //添加第一页
           if(this.curPage - 2 > 1){
            var fist = OulStr.append($('<li class = " item-number ">1</li>'))
             $(this.wrap).append(fist);
           }
           //前面添加....
            if(this.curPage -2 > 2){
                var dot = OulStr.append($('<div class = " item"><span>...</span></div>'))
               $(this.wrap).append(dot);                           
            }
           // 添加中间页码
           for(var i = this.curPage - 2;i<=this.curPage + 2 ;i++){
               if(i > 0 && i<=this.allPage){
                   if(i == this.curPage){
                       var numbera = OulStr.append($('<li class = " item-number active">'+i+'</li>'))
                       $(this.wrap).append(numbera)
                   }else{
                    var numberb = OulStr.append($('<li class = " item-number">'+i+'</li>'))
                    $(this.wrap).append(numberb)
                   }
               }
           }
           // 添加最后的...
           if(this.curPage + 2< this.allPage - 1){
               var dots = OulStr.append($('<div class = " item "><span>...</span></div>'))
               $(this.wrap).append(dots)                  
           }
            //添加最后一页
            if(this.curPage + 2< this.allPage){
                var last = OulStr.append($('<li class = " item-number">'+this.allPage+'</li>'))
               $(this.wrap).append(last);
            }
               // 添加下一页
           if(this.curPage < this.allPage){
               var nextP = OulStr.append($('<li class = " next-page">&gt</li>'))
           $(this.wrap).append(nextP);
          }
        },
        addCss(){
            $('.pageList',this.wrap).css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
        
            })
            $('.pageList > li',this.wrap).css({
               border: '1px solid #ddd',
               boxSizing: 'border-box',
               padding: '5px 15px',
               color: 'rgb(65, 82, 238)',
               marginLeft: '3px',
            })
            $('.pageList > li.active',this.wrap).css({
                color:' #fff',
                backgroundColor:'#555',
                border: '1px solid #555',
             })
             $('.pageList > li:not(.active):hover',this.wrap).css({
                backgroundColor: '#dde',
             })
           
        },
       bindEvent: function(){
           
           //点击上一页
           var self = this ;
            $('.pageList > .prev-page',this.wrap).on('click',function(){
                self.curPage -- ; 
                self.change()
       
            });
            $('.pageList > .next-page',this.wrap).on('click',function(){
               self.curPage ++ ; 
               self.change()
           });
           $('.pageList > .item-number',this.wrap).on('click',function(){
               self.curPage = parseInt($(this).text()) ; 
               self.change()
           }) 
          
       },
       change:function(){
        this.createDom();
        this.bindEvent();
        this.addCss();
        this.changePage(this.curPage)
    }
       
    }
    $.fn.extend({
        turnPages:function(options){
            options.wrap = this;
              obj.TurnPage(options);
            return this;

        }
    })
})(jQuery)