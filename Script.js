var cApath = Qva.Remote + "?public=only&type=Document&name=Extensions/centerAlignPENSKE/";
Qva.LoadCSS(cApath + "style.css");
Qva.AddDocumentExtension('centerAlignPENSKE', function() {
	var _this = this;

	//------------------------------------------------------------------- EPAM
	var elementsUnderGrid;	 // set of elements under Main grid
	var elementsUnderGridDet; // set of elements under Detail grid
	var elementsBeyondGrid;	 // one textbox
	var elementsBeyondGridWhite; // one textbox
	var elementsBeyondGridWhiteDet; // one textbox
	var elementsBeyondGridWhiteDetBottom;
	var bNotExistVarOrEmpty  = {val: false,	toString:function(){return this.val} };;
	

	var	docQv = Qv.GetCurrentDocument();
	docQv.GetAllVariables(function(vars) {
		var sNames;
		var varCount  = {val: 0, toString:function(){return this.val} };

		bNotExistVarOrEmpty.val= false;
		for (var i = 0; i < vars.length; i++) {
			
			
			if (vars[i].name.indexOf("vListObjectsMain")>-1) 			{ elementsUnderGrid			=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value);	}	
			if (vars[i].name.indexOf("vListObjectsDet")>-1) 			{ elementsUnderGridDet		=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value);	}			
			if (vars[i].name.indexOf("vListObjectsBeyondGrid")>-1) 		{ elementsBeyondGrid		=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vWhiteBgBeyondGridMain")>-1) 		{ elementsBeyondGridWhite	=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vWhiteBgBeyondGridDet")>-1) 		{ elementsBeyondGridWhiteDet		=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vWhiteBgBeyondGridDtBottom")>-1)  { elementsBeyondGridWhiteDetBottom 	=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }

			if (vars[i].name.indexOf("vListMainAndDetailGrids")>-1)
			{
				varCount.val++;	
				sNames=vars[i].value.split(" ");
				grMain=$(".QvFrame.Document_"+sNames[0]);
				grDet =$(".QvFrame.Document_"+sNames[1]);
				grDetBottom = (sNames.length>2) ? $(".QvFrame.Document_"+sNames[2]) : null;
				console.log(sNames);
			}
		}
		if (varCount.val<6)
		{
			bNotExistVarOrEmpty.val=true;
		}
	});
	//------------------------------------------------------------------- EPAM
	
	function centerIt() {
		
		//------------------------------------------------------------------- EPAM
		if ((elementsUnderGrid!=undefined) && (!bNotExistVarOrEmpty.val))
		{
			var grMainYBottom = 0;
			if (grMain.css("display")=="none" )
			{
				var grMainY = grDet.position().top+grDet.outerHeight();
				
				if (grDetBottom !== null)
				{
					grDetBottom.css("top", grMainY+72);
					elementsBeyondGridWhiteDetBottom.css("top", grMainY+72);
					grMainYBottom = grDetBottom.position().top+grDetBottom.outerHeight();
				}	
				// fit white substrate to detail grid (top if there are two)
				elementsBeyondGridWhiteDet.each(function(){
					$(this).css("height", grMainY-$(this).position().top).children().filter(".QvContent").css("height", grMainY-$(this).position().top);
				});
				// fit white substrate to bottom detail grid if it exist
				if (grMainYBottom > 0)
				{
					elementsBeyondGridWhiteDetBottom.each(function(){
						$(this).css("height", grMainYBottom-$(this).position().top).children().filter(".QvContent").css("height", grMainYBottom-$(this).position().top);
					});
				}
			}	
			else {
				var grMainY = grMain.position().top+grMain.outerHeight();
				elementsUnderGrid.css("top", grMainY+18);

				// fit white substrate to main grid
				elementsBeyondGridWhite.each(function(){
					$(this).css("height", grMainY-$(this).position().top).children().filter(".QvContent").css("height", grMainY-$(this).position().top);
				});
			}	
			// change height of underlying textbox
			elementsBeyondGrid.each(function(){
				$(this).css("height", Math.max(grMainY, grMainYBottom)-$(this).position().top+72).children().filter(".QvContent").css("height", Math.max(grMainY, grMainYBottom)-$(this).position().top+72);
			});
			// move elements below lowest chart
			elementsUnderGridDet.css("top", Math.max(grMainY, grMainYBottom)+18);
		}
		//------------------------------------------------------------------- EPAM	

		if(!($("body").hasClass("centerAlign"))) {
			$("body").addClass("centerAlign");
			//wrap a container around the whole document and center it.
			$("body").append('<div class="master" />').find('.master').append($('#PageContainer'));
			$("#MainContainer").css("position", "relative");
			//center the tabs if they exist
			$("head").append("<style>.qvtr-tabs{margin:0 auto !important;}</style>");
			//center the background image if there is one.
			$("body").css("background-position", "center 30px");
		}
		var maxRight = 1024;		
		//loop through all QV elements on the page and determine the maximum right position on the page
		//in order to determine the bounding box of the QV doc.  It needs to be done this way because all of the elements
		//are absolutely positioned
		$(".QvFrame").each(function(){
			var tMR = $(this).position().left + $(this).width();
			if(tMR > maxRight){
				maxRight = tMR;
			}
		});
		$(".centerAlign .master").css("width", maxRight + "px");
		$(".qvtr-tabs").css("width", $(".master").width() + "px");
		
		NoGreenLED();
	}
	_this.Document.SetOnUpdateComplete(centerIt);

	// get jQuery objects through names in variables
	function Get_elemets(varCount, bNotExistVarOrEmpty, s)
	{ 
		varCount.val++;	
		var sNames=s.split(" ");
		if (sNames.length==0) 
		{
			bNotExistVarOrEmpty.val=true;
			return null;
		}
		else 
		{
			var elem = $(".QvFrame.Document_"+sNames[0]);
			for (var j=1; j<sNames.length; j++){	
				elem=elem.add($(".QvFrame.Document_"+sNames[j]));
			}
			return  elem;
		}	
	}
	
	function NoGreenLED()
	{ 
		// Some green LEDs do not have their image set in the stylesheet, so we have to directly overwrite it
		$('img.Qv_LED').attr("src","/QvAjaxZfc/QvsViewClient.aspx?datamode=binary&name=LED&host=Local&slot=&public=only&color=%230099ff" );
	}
});
