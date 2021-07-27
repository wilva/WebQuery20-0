/*
Class:
    df.WebEdit
Extends:
    df.WebBaseForm

This is the client-side representation of the WebEdit class. It generates the HTML for the input 
element and possibly a prompt button.
    
Revision:
    2011/10/12  (HW, DAW) 
        Initial version.
*/
df.WebEdit = function WebEdit(oDef, oParent){
    df.WebEdit.base.constructor.call(this, oDef, oParent);
    
    this.prop(df.tInt, "piHeight", 0);
    this.prop(df.tInt, "piMinHeight", 0);
    
    this.prop(df.tBool, "pbStopOnSubmit", true);
    
    // @privates
    this._eWrap = null;
    this._ePrompt = null;
    
    //  Configure super classes
    this._sControlClass = "WebEdit";
};
/*
This class is the implementation of the client-side part of the WebEdit data entry object. It can 
render itself to HTML and implements the published properties from the server. It has special prompt 
button functionality.
*/
df.defineClass("df.WebEdit", "df.WebBaseForm",{

/*
This method generates the HTML for input element. The input element has two wrappers for styling it 
and making space for the prompt button. The HTML for the prompt button is available by default and 
is made visible when needed.

@param  aHtml   String builder array to which HTML can be added.

@private
*/
openHtml : function(aHtml){
    df.WebEdit.base.openHtml.call(this, aHtml);
    
    aHtml.push('<div class="WebFrm_Wrapper"><textarea name="', this._sName, '"></textarea></div>'); 
},

/*
This method is called after rendering and gets references, attaches event handlers and sets property 
values.

@private
*/
afterRender : function(){
    //  Get references
    this._eControl = df.dom.query(this._eElem, "div.WebFrm_Wrapper textarea");
    this._eWrap = df.dom.query(this._eElem, "div.WebFrm_Wrapper");
    
    df.WebEdit.base.afterRender.call(this);
    
    df.events.addDomKeyListener(this._eElem, this.onKey, this);
},

/*
This setter sets the background color of the field. The background color is applied to the wrapper 
div element.

@param  sVal    The bew value.
@private
*/
set_psBackgroundColor : function(sVal){
    if(this._eWrap){
        this._eWrap.style.background = sVal || '';
    }
},

/*
We override this method because the form has an extra wrapper of which the Box Difference needs to 
be taken into account.

@private
*/
setHeight : function(iHeight){
    if(iHeight > 0){
        //  If the label is on top we reduce that (note that this means that piMinHeight and piHeight are including the label)
        if(this.peLabelPosition === df.ciLabelTop){
            iHeight -= this._eLbl.offsetHeight;
        }
        
        //  Substract the wrapping elements
        iHeight -= df.sys.gui.getVertBoxDiff(this._eInner);
        iHeight -= df.sys.gui.getVertBoxDiff(this._eControlWrp);
        iHeight -= df.sys.gui.getVertBoxDiff(this._eWrap);
        iHeight -= df.sys.gui.getVertBoxDiff(this._eControl);
        
        if(df.sys.isChrome){   //  Strange extra pixels in chrome :S
            iHeight--;
            iHeight--;
        }
        
        //  Set the height
        iHeight = (iHeight < 0 ? 0 : iHeight);  //  FIX: IE8 doesn't handle negative values real well and this seems to happen somehow
        this._eControl.style.height = iHeight + "px";
    }else{
        this._eControl.style.height = "";
    }
},

/*
Handles the onKey event and makes sure that it doesn't propagate the enter key if pbStopOnSubmit is 
true to stop the onsubmit event of the view / dialog.

@param  oEvent  Event object (see: df.events.DOMEvent).
@private
*/
onKey : function(oEvent){
    //  Make sure that the OnSubmit doesn't fire by canceling the propagation (but leaving the default behavior, OnClick intact)
    if(oEvent.matchKey(df.settings.formKeys.submit) && this.pbStopOnSubmit){ 
        oEvent.stopPropagation();
    }
}

});