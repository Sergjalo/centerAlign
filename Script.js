var cApath = Qva.Remote + "?public=only&type=Document&name=Extensions/penskefleet/";
Qva.LoadCSS(cApath + "style.css");
Qva.AddDocumentExtension('penskefleet', function() {
	var _this = this;

	//------------------------------------------------------------------- EPAM
	var elementsUnderGrid;	 			// set of elements under summary grid
	var elementsUnderGridDet; 			// set of elements under bottom detail grid
	var elementsBeyondGrid;	 			// dark substrate beyond all charts (summary or detail)
	var elementsBeyondGridWhite; 		// vWhiteBgBeyondGridMain - white substrate for summary chart
	var elementsBeyondGridWhiteDet; 	// vWhiteBgBeyondGridDet - white substrate for first (top) detail chart
	var elementsBeyondGridWhiteDetBottom;	// vWhiteBgBeyondGridDtBottom - white substrate for second detail chart
		
	var elementsBetweenDetTablesWhite; // vWhiteLineBetweenDetTables - white separating line between detail tables

	var elementsLineAboveBottomChart;	// vListSecondLineObj 4 elements that placed between two detail charts
	var deviceType;	 				    // type of device from Qlik 1 - mobile 0 - desktop. Is readed through text object TXVERSION =If(WildMatch(ClientPlatform(),'*mobile*')>0,1,0)
	// deviceType=$(".QvFrame.Document_TXVERSION").children(".QvContent").find("td").html();

	// filter between two detail charts consist of two objects- 
	var elementsBottomFlt1; 			// vListSecondLineFlt1 for ALL list object 
	var elementsBottomFlt2; 			// vListSecondLineFlt2 for list object with column names
	
	var defH;							// default height of item element in a dropdown pivot table list. 19 for font AvenirLTW01-95Black size 12
	var newH; 							// new height of item element in a dropdown pivot table list.
	
	// false if there not enough variables
	var bNotExistVarOrEmpty  = {val: false,	toString:function(){return this.val} };
	
	var	docQv = Qv.GetCurrentDocument();
	docQv.GetAllVariables(function(vars) {
		var sNames;
		var varCount  = {val: 0, toString:function(){return this.val} };

		bNotExistVarOrEmpty.val= false;
		for (var i = 0; i < vars.length; i++) {
			try{
			if (vars[i].name.indexOf("vListObjectsMain")>-1) 			{ elementsUnderGrid			=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value);	}	
			if (vars[i].name.indexOf("vListObjectsDet")>-1) 			{ elementsUnderGridDet		=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value);	}			
			if (vars[i].name.indexOf("vListObjectsBeyondGrid")>-1) 		{ elementsBeyondGrid		=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vWhiteBgBeyondGridMain")>-1) 		{ elementsBeyondGridWhite	=Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vWhiteBgBeyondGridDet")>-1) 		{ elementsBeyondGridWhiteDet		 =Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			if (vars[i].name.indexOf("vWhiteBgBeyondGridDtBottom")>-1) 	{ elementsBeyondGridWhiteDetBottom 	 =Get_elemets(varCount, bNotExistVarOrEmpty, vars[i].value); }
			
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
			if (vars[i].name.indexOf("vDropDownListSizeDef")>-1) { defH=vars[i].value; varCount.val++; }
			if (vars[i].name.indexOf("vDropDownListSizeNew")>-1) { newH=vars[i].value; varCount.val++; }
			}
			catch(err) {
				console.log(err);
				console.log('at iteration ' + i +', var name is '+ vars[i].name + ', val is '+ vars[i].value + ', type is '+ typeof vars[i]);
			}
		}
		if (varCount.val<13)
		{
			bNotExistVarOrEmpty.val=true;
		}
	});
	//------------------------------------------------------------------- EPAM
	
	function makeAdjustments() {
	if ((elementsUnderGrid!=undefined) && (!bNotExistVarOrEmpty.val) && (grMain.length>0)) 
		{
			var grMainYBottom = 0;
			
			//only for desktop versions
			//if (deviceType==0) {	}
	
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
					//console.log($(this).css("height")+" _top="+$(this).position().top+" grMainY=" +grMainY);
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
		
			// padding in cells
			$(".Qv_multiline.Qv_middle").filter(function(index){
				return ((($(this).parent(".injected").parent().css("text-align")=="left") ||
					($(this).parent().parent(".injected").parent().css("text-align")=="left"))
					// to not impact on filters
					&&
					($(this).siblings(".Qv_CellIcon_right").length==0))
			}).css('padding-left', 5);
			
			$(".Qv_multiline.Qv_middle").filter(function(index){
				return ($(this).parent(".injected").parent().css("text-align")=="right")
			}).each(function(){
				$(this).width($(this).parent().width()-5);
			});	

			//--------------	*spacing in dropdown listboxes		------------------
			//console.log("spacing");

			itemsFAll=$(".QvFrame.DS").children(".QvContent").children(".QvListbox");
			if (itemsFAll.children(".Qv_ScrollbarHorizontalDivider").css("display")!="none") 
			{ 
				hScroll=12;
			} else {
				hScroll=0;
			}
			//newH=45; // new spacing
			// define number of items
			k=itemsFAll.children().first().find(".QvOptional, .QvExcluded, .QvSelected").length; //QvSelected_Led_363636
			// calculate new total height
			newHeight=k*newH+hScroll;
			// set new total height
			itemsFlt=$(".QvFrame.DS").height(newHeight).children(".QvContent").height(newHeight).children(".QvListbox").height(newHeight).children().first().height(newHeight).find(".QvOptional, .QvExcluded, .QvSelected");
			// obtain old row height
			//defH=26;//itemsFlt.first().height(); //19
			//console.log(itemsFlt.first().height()+" "+newH);
			//shift rows according to new width
			itemsFlt.each(function(){
				//console.log(" height="+$(this).height());
				if($(this).height()==defH) {
					//tp0=$(this).position().top;
					//tp=$(this).position().top/defH*newH;
					$(this).css("top",$(this).position().top/defH*newH);
					//console.log($(this).attr("title") + " _ "+ tp0 + " _ "+tp+ " _ defH="+defH+ " _ newH=" +newH + " height="+$(this).height());
				}
			});
			// set new row height
			itemsFlt.height(newH).children().height(newH).children().height(newH);
			//console.log("items count:"+ k + " nh="+newHeight);
			// border and padding
			itemsFlt.children().css("border-top-width",1);
			itemsFlt.children().css("border-top-color","#e8e8ea");
			itemsFlt.children().css("border-top-style","solid");
			itemsFlt.children().children().css("padding-top",newH/3);
			//padding for listbox
			$(".QvFrame").children(".QvContent").children(".QvListbox").find(".Qv_multiline").css("padding-top",10);
			
			// place scroll bars at the bottom 
			if (hScroll>0) 
			{
				//console.log(itemsFAll.children(".Qv_ScrollbarHorizontalDivider").css("display")+hScroll);
				itemsFAll.children(".TouchScrollbar").css("top",newHeight-(hScroll-2));
				itemsFAll.children(".Qv_ScrollbarHorizontalDivider, .Qv_ScrollbarBackground").css("top",newHeight-hScroll);
			}
			//--------------	spacing in dropdown listboxes*		------------------
			//defH=26;
		}
		NoGreenLED();
	}
	
	_this.Document.SetOnUpdateComplete(makeAdjustments);

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
