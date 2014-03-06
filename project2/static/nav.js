$(function() {
                var d=300;
                $('#navigation a').each(function(){
                    var $this = $(this);
					var r=Math.floor(Math.random()*41)-20;
                    $this.css({'-moz-transform':'rotate('+r+'deg)','-webkit-transform':'rotate('+r+'deg)','transform':'rotate('+r+'deg)'});
                    $this.stop().animate({
                        'marginTop':'-70px'                       
                    },d+=150);
                });
				
                $('#navigation > li').hover(
					function () {
						var $this = $(this);
						$('a',$this).stop().animate({
							'marginTop':'-50px'
						},200);
					},
					function () {
						var $this = $(this);
						$('a',$this).stop().animate({
							'marginTop':'-70px'
						},200);
					}
				);
				
				 $('#navigation > #save').click(function(){
					var $this = $(this);					
					$('#content').animate({marginTop:-600}, 400,function(){
						var $this = $(this);
						$this.animate({marginTop:0}, 500); 
					})		 
				});
            });