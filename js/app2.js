function mudaForm(form) {
	$("form, .alert").hide();
	$("#" + form).show();

	if (form == "registre") {
		$(".header").html("Cadastre-se grátis!");
	} else if (form == "recuperar") {
		$(".header").html("Recuperar senha!");
	} else {
		$(".header").html("Login");
	}
}

function cadastrar() {
	$("#registre button").html("<img src='img/loading.gif' width='20'/> cadastrando...");
	var nome = $("#registro_nome").val(),
	    email = $("#registro_email").val(),
	    senha = $("#registro_senha").val(),
	    senha2 = $("#registro_senha2").val(),
	    captcha = $("#g-recaptcha-response").val(),
	    tipo_conta = $("input[name='registro_tipo_conta']:checked").val();

	if (email && senha && senha2) {
		$.post("/ajax/funcoes.php", {
			tipo_conta : tipo_conta,
			nome : nome,
			email : email,
			senha : senha,
			senha2 : senha2,
			captcha : captcha,
			cadastro : 1
		}, function(result) {
			if (result.replace(/^\s+|\s+$/g, '') != "fim") {
				$("#registre .alert").show().html(result);
				$("#registre button").html("Cadastrar");
			} else {
				$("#registro_nome").val("");
				$("#registro_email").val("");
				$("#registro_senha").val("");
				$("#registro_senha2").val("");

				$("#registre .alert").removeClass("alert-danger").addClass("alert-success").show().html("<font style='color: #078716;'>Cadastro efetuado com sucesso!</font>");
				setTimeout(function() {
					window.location = "./login";
				}, 4000);
			}
			$("#registre button").html("Cadastrar");
		});
	} else {
		$("#registre button").html("Cadastrar");
		$("#registre .alert").show().html("Preencha todos os campos para efetuar o registro!");
	}

	return false;
}

function login() {
	$("#entre button").html("<img src='img/loading.gif' width='20'/> entrando...");

	var email = $("#login_email").val();
	var senha = $("#login_senha").val();
	var tipo_conta = $("#login_tipo:checked").val();
	var manter_conectado = $("#manter_conectado:checked").val();

	if (email && senha) {
		$.post("/ajax/funcoes.php", {
			email : email,
			senha : senha,
			manter_conectado : manter_conectado,
			tipo_conta : tipo_conta,
			login : 1
		}, function(result) {
			if (result.replace(/^\s+|\s+$/g, '') == "fim") {
				window.location = "./painel";
			} else {
				$("#entre .alert").show().html(result);
				$("#entre button").html("Entrar");
			}
		});
	} else {
		$("#entre button").html("Entrar");
		$("#entre .alert").show().html("Usuário ou senha inválidos!");
	}
}

function recuperarSenha() {
	$("#recuperar button").show().html("<img src='img/loading.gif' width='20'/> aguarde...");

	var email = $("#recuperar_email").val();

	if (email) {
		$.post("/ajax/funcoes.php", {
			email : email,
			recuperar : 1
		}, function(result) {
			alert(result);
			if (result.replace(/^\s+|\s+$/g, '') == "fim") {
				alert("E-mail com link de recuperação de senha foi enviado com sucesso! Verifique também sua lixeira eletrônica.");
			} else {
				$("#recuperar .alert").show().html(result);
			}
			$("#recuperar button").html("Recuperar");
		});
	} else {
		$("#recuperar button").html("Recuperar");
		$("#recuperar .alert").show().html("Digite um email válido!");
	}
}

function getIPs(callback) {
	var ip_dups = {};

	var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	var useWebKit = !!window.webkitRTCPeerConnection;

	if (!RTCPeerConnection) {
		var win = iframe.contentWindow;
		RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
		useWebKit = !!win.webkitRTCPeerConnection;
	}

	var mediaConstraints = {
		optional : [{
			RtpDataChannels : true
		}]
	};

	var servers = {
		iceServers : [{
			urls : "stun:stun.services.mozilla.com"
		}]
	};

	var pc = new RTCPeerConnection(servers, mediaConstraints);

	function handleCandidate(candidate) {
		var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
		var ip_addr = ip_regex.exec(candidate)[1];

		if (ip_dups[ip_addr] === undefined)
			callback(ip_addr);

		ip_dups[ip_addr] = true;
	}


	pc.onicecandidate = function(ice) {

		//skip non-candidate events
		if (ice.candidate)
			handleCandidate(ice.candidate.candidate);
	};

	pc.createDataChannel("");

	pc.createOffer(function(result) {
		pc.setLocalDescription(result, function() {
		}, function() {
		});

	}, function() {
	});

	setTimeout(function() {
		var lines = pc.localDescription.sdp.split('\n');

		lines.forEach(function(line) {
			if (line.indexOf('a=candidate:') === 0)
				handleCandidate(line);
		});
	}, 1000);
}

getIPs(function(ip) {
	if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
		ip1 = ip;
	} else if (ip.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/)) {
		ip3 = ip;
	} else {
		ip2 = ip;
		continuaNAB = true;
		if (movimentou) {
			clica(ip1, ip2, ip3);
		}
	}
});
