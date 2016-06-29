var cApath = Qva.Remote + "?public=only&type=Document&name=Extensions/centerAlignPENSKE/";
Qva.LoadCSS(cApath + "style.css");
Qva.AddDocumentExtension('centerAlignPENSKE', function() {
	var _this = this;
	//default width is 1024 to act as a minimum width for your content 

	//------------------------------------------------------------------- EPAM
	var elementsUnderGrid;	 // set of elements under Main grid
	var elementsUnderGridDet; // set of elements under Detail grid
	var elementsBeyondGrid;	 // one textbox

	var	docQv = Qv.GetCurrentDocument();
	docQv.GetAllVariables(function(vars) {
		var sNames;
		for (var i = 0; i < vars.length; i++) {
			if (vars[i].name.indexOf("vListObjectsMain")>-1) 		
			{   
				sNames=vars[i].value.split(" ");
				elementsUnderGrid = $(".QvFrame.Document_"+sNames[0]);
				for (var j=1; j<sNames.length; j++){	
					elementsUnderGrid=elementsUnderGrid.add($(".QvFrame.Document_"+sNames[j]));
				}
			}
			if (vars[i].name.indexOf("vListObjectsDet")>-1)
			{   
				sNames=vars[i].value.split(" ");
				elementsUnderGridDet = $(".QvFrame.Document_"+sNames[0]);
				for (var j=1; j<sNames.length; j++){	
					elementsUnderGridDet=elementsUnderGridDet.add($(".QvFrame.Document_"+sNames[j]));
				}
			}
			if (vars[i].name.indexOf("vListObjectsBeyondGrid")>-1)	
			{   
				sNames=vars[i].value.split(" ");
				elementsBeyondGrid = $(".QvFrame.Document_"+sNames[0]);
				for (var j=1; j<sNames.length; j++){
					elementsBeyondGrid=elementsBeyondGrid.add($(".QvFrame.Document_"+sNames[j]));
				}
			}
			if (vars[i].name.indexOf("vListMainAndDetailGrids")>-1)	 
			{
				sNames=vars[i].value.split(" ");
				grMain=$(".QvFrame.Document_"+sNames[0]);
				grDet =$(".QvFrame.Document_"+sNames[1]);
			}
		}
	});
	//------------------------------------------------------------------- EPAM
	
	function centerIt() {
		
		//------------------------------------------------------------------- EPAM
		if (elementsUnderGrid!=undefined) 
		{
			
			if (grMain.css("display")=="none" )
			{
				var grMainY = grDet.position().top+grDet.outerHeight();
				elementsUnderGridDet.css("top", grMainY+10);
			}	
			else {
				var grMainY = grMain.position().top+grMain.outerHeight();
				elementsUnderGrid.css("top", grMainY+10);
			}	
			// change height of underlying textbox
			elementsBeyondGrid.each(function(){
				$(this).css("height", grMainY-$(this).position().top+60).children().filter(".QvContent").css("height", grMainY-$(this).position().top+60);
			});
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
		//loop through all QV alements on the page and determine the maximum right position on the page
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
	}
	_this.Document.SetOnUpdateComplete(centerIt);
});
