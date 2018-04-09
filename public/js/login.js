$(function(){
	function register(){
		$(".loginContent").css("display","none");
		$(".regContent").css("display","block");
		$(".navLogin").css("border-bottom","none");
		$(".navReg").css("border-bottom","3px solid #dd6572");
	}
	function login(){
		$(".loginContent").css("display","block");
		$(".regContent").css("display","none");
		$(".navReg").css("border-bottom","none");
		$(".navLogin").css("border-bottom","3px solid #dd6572");
	}
	$(".navReg").on("click",function(){
		register();
	});
	$("#skip_Reg").on("click",function(){
		register();
	});
	
	$(".navLogin").on("click",function(){
		login();
	});
	$("#skip_login").on("click",function(){
		login();
	});
	
	
	
});
