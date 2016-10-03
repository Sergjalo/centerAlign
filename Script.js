var cApath = Qva.Remote + "?public=only&type=Document&name=Extensions/centerAlignPENSKE/";
Qva.LoadCSS(cApath + "style.css");
Qva.AddDocumentExtension('centerAlignPENSKE', function() {
	var _this = this;

	//------------------------------------------------------------------- EPAM
	var elementsUnderGrid;	 			// set of elements under summary grid
	var elementsUnderGridDet; 			// set of elements under bottom detail grid
	var elementsBeyondGrid;	 			// dark substrate beyond all charts (summary or detail)
	var elementsBeyondGridWhite; 		// vWhiteBgBeyondGridMain - white substrate for summary chart
	var elementsBeyondGridWhiteDet; 	// vWhiteBgBeyondGridDet - white substrate for first (top) detail chart
	var elementsBeyondGridWhiteDetBottom; // vWhiteBgBeyondGridDtBottom - white substrate for second detail chart
	
	var elementsBetweenDetTablesWhite; // vWhiteLineBetweenDetTables - white separating line between detail tables

	var elementsLineAboveBottomChart;	// vListSecondLineObj 4 elements that placed between two detail charts
	var deviceType;	 				    // type of device from Qlik 1 - mobile 0 - desktop. Is readed through text object TXVERSION =If(WildMatch(ClientPlatform(),'*mobile*')>0,1,0)

	//filter between two detail charts consist of two objects- 
	var elementsBottomFlt1; 			// vListSecondLineFlt1 for ALL list object 
	var elementsBottomFlt2; 			// vListSecondLineFlt2 for list object with column names
	
	// false if there not enough variables
	var bNotExistVarOrEmpty  = {val: false,	toString:function(){return this.val} };
	
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
			
			if (vars[i].name.indexOf("vWhiteLineBetweenDetTables")>-1)  { elementsBetweenDetTablesWhite 	=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }

			if (vars[i].name.indexOf("vListSecondLineObj")>-1)   { elementsLineAboveBottomChart		=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vListSecondLineFlt1")>-1)  { elementsBottomFlt1 				=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vListSecondLineFlt2")>-1)  { elementsBottomFlt2 				=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }

			if (vars[i].name.indexOf("vListMainAndDetailGrids")>-1)
			{
				varCount.val++;	
				sNames=vars[i].value.split(" ");
				grMain=$(".QvFrame.Document_"+sNames[0]);
				grDet =$(".QvFrame.Document_"+sNames[1]);
				grDetBottom = (sNames.length>2) ? $(".QvFrame.Document_"+sNames[2]) : null;
			}
		}
		if (varCount.val<11)
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
			
			// define is it detail view or summary
			if (grMain.css("display")=="none" )
			{
				// evaluate Y position of bottom edge of detail chart. If there are two - of one that is on top
				var grMainY = grDet.position().top+grDet.outerHeight();
				
				// is there another detail chart placed below?
				if (grDetBottom !== null)
				{
					// shift white line between two detail tables below first detail
					elementsBetweenDetTablesWhite.css("top", grMainY+30);
					
					// evaluate Y position of white separating line
					var lineSepY = elementsBetweenDetTablesWhite.position().top+elementsBetweenDetTablesWhite.outerHeight();
					
					// shift it and white substrate under top chart
					grDetBottom.each(function(){
						$(this).css("top", lineSepY+72);
					});	
					elementsBeyondGridWhiteDetBottom.css("top", lineSepY+72);
									
					// get same Y position as grMainY but for bottom detail
					grMainYBottom = grDetBottom.position().top+grDetBottom.outerHeight();

					// fit white substrate to bottom detail grid
					elementsBeyondGridWhiteDetBottom.each(function(){
						$(this).css("height", grMainYBottom-$(this).position().top).children().filter(".QvContent").css("height", grMainYBottom-$(this).position().top);
					});
					
					// place elements that are between detail charts
					elementsLineAboveBottomChart.each(function(){
						$(this).css("top", lineSepY+18);
					});
					elementsBottomFlt1.each(function(){
						$(this).css("top", lineSepY+59);
					});
					elementsBottomFlt2.each(function(){
						$(this).css("top", lineSepY+79);
					});
				}	
				// fit white substrate to detail grid (top if there are two)
				elementsBeyondGridWhiteDet.each(function(){
					$(this).css("height", grMainY-$(this).position().top).children().filter(".QvContent").css("height", grMainY-$(this).position().top);
				});
			}	
			else {
				var grMainY = grMain.position().top+grMain.outerHeight();
				elementsUnderGrid.each(function(){
					$(this).css("top", grMainY+18);
				});
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
			elementsUnderGridDet.each(function(){
				$(this).css("top", Math.max(grMainY, grMainYBottom)+18);
			});
		
		$(".Qv_multiline.Qv_middle").filter(function(index){
			return (($(this).parent(".injected").parent().css("text-align")=="left") ||
				($(this).parent().parent(".injected").parent().css("text-align")=="left"))
		}).css('padding-left', 5);
		$(".Qv_multiline.Qv_middle").filter(function(index){
			return ($(this).parent(".injected").parent().css("text-align")=="right")
		}).each(function(){
			$(this).width($(this).parent().width()-5);
		});	
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
		//only for elems that are in centered container
		//only for desctop versions
		deviceType=$(".QvFrame.Document_TXVERSION").children(".QvContent").find("td").html();
		if (deviceType==0)
		{
			$(".QvFrame").each(function(){
				if ($(this).parents('.master').length) {
					var tMR = $(this).position().left + $(this).width();
					if(tMR > maxRight){
						maxRight = tMR;
					}
				}
			});
		
			$(".centerAlign .master").css("width", maxRight + "px");
			$(".qvtr-tabs").css("width", $(".master").width() + "px");
		}	
		
		NoGreenLED();
	}
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
		
		// change arrow in filters dropdown menu 
		$('.cell-icon.cell-ODDC-icon').removeClass( "cell-icon cell-ODDC-icon" ).addClass( "ui-icon QvArrowDropDown");
		
		// change arrow in serch box dropdown menu
		$('.prop-dyn-dynamic-dropdown-search-open').removeClass( "prop-icon-24x24 prop-dyn-dynamic-dropdown-search-open" ).addClass( "ui-icon QvArrowDropDownSearch");
		$('.prop-dyn-dynamic-dropdown-search-close').removeClass( "prop-icon-24x24 prop-dyn-dynamic-dropdown-search-close" ).addClass( "ui-icon QvArrowDropDownSearch");
		
		//remove search icon in the search box
		$('.prop-icon-24x24.prop-dyn-dynamic-dropdown-search-icon').removeClass( "prop-icon-24x24 prop-dyn-dynamic-dropdown-search-icon" );
		
		// chenge native icon for table Export to Excel
		$('.QvCaptionIcon.caption-icon-16x16.caption-XL-dark-icon').width(185).height(40);
		$('.QvCaptionIcon.caption-icon-16x16.caption-XL-dark-icon').removeClass( "caption-icon-16x16 caption-XL-dark-icon" ).addClass( "ui-icon QvDownloadTableIcon" );
		$('.QvDownloadTableIcon').attr('title','Download Table to Excel');
	}
});
