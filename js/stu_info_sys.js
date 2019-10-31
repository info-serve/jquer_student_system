var TableDataList = [];//存储数据
var search_words = '',
    pageSize = 9 ,//每页展示条数
    curPage = 1;
//绑定页面事件
function bindEvent(){
  //leftmenu
  $('.left-menu > dl').on('click','dd',function(e){
   //    console.log(e.target) 
      var stuId = $(this).attr('data-id');
         console.log(stuId)
       $('.content').fadeOut();
       $('#' + stuId).fadeIn();
       $('.left-menu > dl > .active').removeClass('active');
       $(this).addClass('active');
       if(stuId  == 'stuList'){
              getTablePageDate();
       }
  });


  //新增学生
  $('#Addsubmit').click(function(e){
      e.preventDefault();
     var data = FormDate($('#add-stut'));
     getTrafromData('/api/student/addStudent',data,function(res){
         if(res.status == 'success'){
             alert('添加成功');
             $('#add-stut')[0].reset();
             $('.left-menu > dl > dd[data-id=stuList]').trigger('click');      
          }else{
             alert(res.msg)
         }
     })
      
  });


  //编辑学生
   $('#editBtn').on('click',function(e){
       e.preventDefault();
     var date = FormDate($('#editStu'));
       getTrafromData('/api/student/updateStudent',date,function(res){
        if(res.status == 'success'){
            alert('修改成功');
            $('#editStu')[0].reset();
            $('.left-menu > dl > dd[data-id=stuList]').trigger('click');
        }else{
            alert(res.msg)
        }
       });
   });

   //查询所有数据事件
   $('.findAll-btn').on('click',function(e){
   getTrafromData('/api/student/findAll',{
       appkey:'xiaobaobao_1570109455962'
   },function(res){
       if(res.status =='success'){
               alert('已成功查询,并展现在页面')
               renderTablePage(res.data);
       }
   })
   });

   //搜索功能
   $('#searchBtn').on('click',function(e){
       var search_words = $('.searchInput').val();
       console.log(search_words);
       if(search_words){
         curPage = 1;
         getSearch_words(search_words)
       }else{
           getTablePageDate()
       }
   });
}

//搜索函数
function getSearch_words(search_words){
   getTrafromData('/api/student/searchStudent',{
       sex:-1,
       search:search_words,
       page:curPage,
       size:pageSize
   },function(res){
       TableDataList = res.data.searchList;
       if(res.status == 'success'){
       var allPage = Math.ceil(res.data.cont/pageSize)
       $('.pagesList').turnPages({
           curPage:curPage,
           allPage:allPage,
           changePage:(page)=>{
               curPage = page
               getSearch_words(search_words)
           }
       });
           renderTablePage(res.data.searchList);
       }else{
          alert(res.msg)
       }
   });
}





//获取表格页面的数据
function getTablePageDate(){
   getTrafromData('/api/student/findByPage',{
       page:curPage,
       size:pageSize,
   },function(res){
      if(res.status =='success'){
          $('#show-data').text(res.data.cont);//展示页面总共数据
          TableDataList = res.data.findByPage
           var allPage = Math.ceil(res.data.cont /pageSize);
           $('.pagesList').turnPages({
               curPage:curPage,
               allPage:allPage,
               changePage:(page)=>{
                   curPage = page
                   getTablePageDate();
               }
           })
          renderTablePage(res.data.findByPage);
      }else{
          alert(res.msg);
      }
   })

}



//序列化表格 获取数据
function FormDate(dom){
 var getData = $(dom).serializeArray();
 var result = {}
 getData.forEach(function(item,index){
     result[item.name] = item.value
 });
 return result;
}



//渲染页面
function renderTablePage(data){
   htmlStr = ' ',
   data.forEach(function(ele,index){
       htmlStr +=`
       <tr>
       <td>${ele.sNo}</td>
       <td>${ele.name}</td>
       <td>${(ele.sex) == 0 ? '男' : '女'}</td>
       <td>${ele.email}</td>
       <td>${new Date().getFullYear()-(ele.birth)}</td>
       <td>${ele.phone}</td>
       <td>${ele.address}</td>
       <td>
           <button class="btn eidt" id="editBtn" data-index = ${index}>编辑</button>
           <button class="btn del" id="delBtn" data-index = ${index}>删除</button>
       </td>
   </tr>
       `
   });
   $('table > tbody').html(htmlStr);
   tableBinEvent();
}




//页面渲染事件(编辑、删除)
function  tableBinEvent(){
   //编辑事件
   $('.eidt').click(function(e){
       var index = $(this).attr('data-index');
       // console.log(TableDataList[index]);
       returnDataTable(TableDataList[index]);//数据回填
       $('.modle').slideDown();
       $('.modle >.modle-content ').click(function(e){
          e.stopPropagation();
       })
       $('.modle >.modle-content > .close').click(function(e){
           $('.modle').fadeOut();
       })
   });
   //删除事件
   $('.del').click(function(e){
       var index = $(this).attr('data-index');
       // console.log(TableDataList[index])
       getTrafromData('/api/student/delBySno',{
           sNo:TableDataList[index].sNo
       },function(res){
           var isDel = window.confirm('你是否删除该条信息?')
           if(isDel){
               if(res.status == 'success'){
                   alert('删除成功');
                   $('.left-menu > dl > dd[data-id=stuList]').trigger('click'); 
               }else{
                   alert(res.msg);
               }
           }
       })
   });
}
//点击编辑按钮数据回填
function returnDataTable(data){
     var eidtData = $('#editStu')[0];
   for(var prop in data){
       if(eidtData[prop]){
           eidtData[prop].value = data[prop];
       }
   }
}



//封装请求函数
function getTrafromData(API,data,callback){
    $.ajax({
        type:'get',
        url:'http://open.duyiedu.com' + API,
        dataType:'json',
        data:{
            appkey:'xiaobaobao_1570109455962 ',
              ...data
        },
        success:function(res){
            if(res.status =='success'){
                callback(res);
            }else{
                alert(res.msg);
            }
        }
    })
}

//初始化事件
function init(){
   bindEvent();
   $('.left-menu > dl >dd[data-id = stuList]').trigger('click');
}
init();