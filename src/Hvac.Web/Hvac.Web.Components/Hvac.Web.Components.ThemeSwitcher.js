rtl.module("System",[],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.LineEnding = "\n";
  this.sLineBreak = this.LineEnding;
  this.PathDelim = "/";
  this.$rtti.$Set("AllowDirectorySeparators$a",{comptype: rtl.char});
  this.AllowDirectorySeparators = rtl.createSet(47);
  this.$rtti.$Set("AllowDriveSeparators$a",{comptype: rtl.char});
  this.AllowDriveSeparators = rtl.createSet(58);
  this.ExtensionSeparator = ".";
  this.MaxSmallint = 32767;
  this.MinSmallint = -32768;
  this.MaxShortInt = 127;
  this.MinShortInt = -128;
  this.MaxByte = 0xFF;
  this.MaxWord = 0xFFFF;
  this.MaxLongint = 0x7fffffff;
  this.MaxCardinal = 0xffffffff;
  this.Maxint = 2147483647;
  this.IsMultiThread = false;
  this.$rtti.$inherited("Real",rtl.double,{});
  this.$rtti.$inherited("Extended",rtl.double,{});
  this.$rtti.$inherited("TDateTime",rtl.double,{});
  this.$rtti.$inherited("TTime",this.$rtti["TDateTime"],{});
  this.$rtti.$inherited("TDate",this.$rtti["TDateTime"],{});
  this.$rtti.$inherited("Int64",rtl.nativeint,{});
  this.$rtti.$inherited("UInt64",rtl.nativeuint,{});
  this.$rtti.$inherited("QWord",rtl.nativeuint,{});
  this.$rtti.$inherited("Single",rtl.double,{});
  this.$rtti.$inherited("Comp",rtl.nativeint,{});
  this.$rtti.$inherited("UnicodeString",rtl.string,{});
  this.$rtti.$inherited("WideString",rtl.string,{});
  this.TTextLineBreakStyle = {"0": "tlbsLF", tlbsLF: 0, "1": "tlbsCRLF", tlbsCRLF: 1, "2": "tlbsCR", tlbsCR: 2};
  this.$rtti.$Enum("TTextLineBreakStyle",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TTextLineBreakStyle});
  this.TCompareOption = {"0": "coIgnoreCase", coIgnoreCase: 0};
  this.$rtti.$Enum("TCompareOption",{minvalue: 0, maxvalue: 0, ordtype: 1, enumtype: this.TCompareOption});
  this.$rtti.$Set("TCompareOptions",{comptype: this.$rtti["TCompareOption"]});
  rtl.recNewT(this,"TGuid",function () {
    this.D1 = 0;
    this.D2 = 0;
    this.D3 = 0;
    this.$new = function () {
      var r = Object.create(this);
      r.D4 = rtl.arraySetLength(null,0,8);
      return r;
    };
    this.$eq = function (b) {
      return (this.D1 === b.D1) && (this.D2 === b.D2) && (this.D3 === b.D3) && rtl.arrayEq(this.D4,b.D4);
    };
    this.$assign = function (s) {
      this.D1 = s.D1;
      this.D2 = s.D2;
      this.D3 = s.D3;
      this.D4 = s.D4.slice(0);
      return this;
    };
    var $r = $mod.$rtti.$Record("TGuid",{});
    $r.addField("D1",rtl.longword);
    $r.addField("D2",rtl.word);
    $r.addField("D3",rtl.word);
    $mod.$rtti.$StaticArray("TGuid.D4$a",{dims: [8], eltype: rtl.byte});
    $r.addField("D4",$mod.$rtti["TGuid.D4$a"]);
  });
  this.$rtti.$inherited("TGUIDString",rtl.string,{});
  rtl.recNewT(this,"TMethod",function () {
    this.Code = null;
    this.Data = null;
    this.$eq = function (b) {
      return (this.Code === b.Code) && (this.Data === b.Data);
    };
    this.$assign = function (s) {
      this.Code = s.Code;
      this.Data = s.Data;
      return this;
    };
    var $r = $mod.$rtti.$Record("TMethod",{});
    $r.addField("Code",rtl.pointer);
    $r.addField("Data",rtl.pointer);
  });
  this.$rtti.$Pointer("PMethod",{reftype: this.$rtti["TMethod"]});
  this.$rtti.$Class("TObject");
  this.$rtti.$ClassRef("TClass",{instancetype: this.$rtti["TObject"]});
  rtl.createClass(this,"TObject",null,function () {
    this.$init = function () {
    };
    this.$final = function () {
    };
    this.Create = function () {
      return this;
    };
    this.Destroy = function () {
    };
    this.Free = function () {
      this.$destroy("Destroy");
    };
    this.ClassType = function () {
      return this;
    };
    this.ClassNameIs = function (Name) {
      var Result = false;
      Result = $impl.SameText(Name,this.$classname);
      return Result;
    };
    this.InheritsFrom = function (aClass) {
      return (aClass!=null) && ((this==aClass) || aClass.isPrototypeOf(this));
    };
    this.MethodName = function (aCode) {
      var Result = "";
      Result = "";
      if (aCode === null) return Result;
      if (typeof(aCode)!=='function') return "";
      var i = 0;
      var TI = this.$rtti;
      if (rtl.isObject(aCode.scope)){
        // callback
        if (typeof aCode.fn === "string") return aCode.fn;
        aCode = aCode.fn;
      }
      // Not a callback, check rtti
      while ((Result === "") && (TI != null)) {
        i = 0;
        while ((Result === "") && (i < TI.methods.length)) {
          if (this[TI.getMethod(i).name] === aCode)
            Result=TI.getMethod(i).name;
          i += 1;
        };
        if (Result === "") TI = TI.ancestor;
      };
      // return Result;
      return Result;
    };
    this.MethodAddress = function (aName) {
      var Result = null;
      Result = null;
      if (aName === "") return Result;
      var i = 0;
        var TI = this.$rtti;
        var N = "";
        var MN = "";
        N = aName.toLowerCase();
        while ((MN === "") && (TI != null)) {
          i = 0;
          while ((MN === "") && (i < TI.methods.length)) {
            if (TI.getMethod(i).name.toLowerCase() === N) MN = TI.getMethod(i).name;
            i += 1;
          };
          if (MN === "") TI = TI.ancestor;
        };
        if (MN !== "") Result = this[MN];
      //  return Result;
      return Result;
    };
    this.FieldAddress = function (aName) {
      var Result = null;
      Result = null;
      if (aName === "") return Result;
      var aClass = this.$class;
      var ClassTI = null;
      var myName = aName.toLowerCase();
      var MemberTI = null;
      while (aClass !== null) {
        ClassTI = aClass.$rtti;
        for (var i = 0, $end2 = ClassTI.fields.length - 1; i <= $end2; i++) {
          MemberTI = ClassTI.getField(i);
          if (MemberTI.name.toLowerCase() === myName) {
             return MemberTI;
          };
        };
        aClass = aClass.$ancestor ? aClass.$ancestor : null;
      };
      return Result;
    };
    this.ClassInfo = function () {
      var Result = null;
      Result = this.$rtti;
      return Result;
    };
    this.QualifiedClassName = function () {
      var Result = "";
      Result = this.$module.$name + "." + this.$classname;
      return Result;
    };
    this.AfterConstruction = function () {
    };
    this.BeforeDestruction = function () {
    };
    this.Dispatch = function (aMessage) {
      var aClass = null;
      var Id = undefined;
      if (!rtl.isObject(aMessage)) return;
      Id = aMessage["Msg"];
      if (!rtl.isNumber(Id)) return;
      aClass = this.$class.ClassType();
      while (aClass !== null) {
        var Handlers = aClass.$msgint;
        if (rtl.isObject(Handlers) && Handlers.hasOwnProperty(Id)){
          this[Handlers[Id]](aMessage);
          return;
        };
        aClass = aClass.$ancestor;
      };
      this.DefaultHandler(aMessage);
    };
    this.DispatchStr = function (aMessage) {
      var aClass = null;
      var Id = undefined;
      if (!rtl.isObject(aMessage)) return;
      Id = aMessage["MsgStr"];
      if (!rtl.isString(Id)) return;
      aClass = this.$class.ClassType();
      while (aClass !== null) {
        var Handlers = aClass.$msgstr;
        if (rtl.isObject(Handlers) && Handlers.hasOwnProperty(Id)){
          this[Handlers[Id]](aMessage);
          return;
        };
        aClass = aClass.$ancestor;
      };
      this.DefaultHandlerStr(aMessage);
    };
    this.DefaultHandler = function (aMessage) {
      if (aMessage) ;
    };
    this.DefaultHandlerStr = function (aMessage) {
      if (aMessage) ;
    };
    this.GetInterface = function (iid, obj) {
      var Result = false;
      var i = iid.$intf;
      if (i){
        // iid is the private TGuid of an interface
        i = rtl.getIntfG(this,i.$guid,2);
        if (i){
          obj.set(i);
          return true;
        }
      };
      Result = this.GetInterfaceByStr(rtl.guidrToStr(iid),obj);
      return Result;
    };
    this.GetInterface$1 = function (iidstr, obj) {
      var Result = false;
      Result = this.GetInterfaceByStr(iidstr,obj);
      return Result;
    };
    this.GetInterfaceByStr = function (iidstr, obj) {
      var Result = false;
      Result = false;
      if (!$mod.IObjectInstance["$str"]) $mod.IObjectInstance["$str"] = rtl.guidrToStr($mod.IObjectInstance);
      if (iidstr == $mod.IObjectInstance["$str"]) {
        obj.set(this);
        return true;
      };
      var i = rtl.getIntfG(this,iidstr,2);
      obj.set(i);
      Result=(i!==null);
      return Result;
    };
    this.GetInterfaceWeak = function (iid, obj) {
      var Result = false;
      Result = this.GetInterface(iid,obj);
      if (Result){
        var o = obj.get();
        if (o.$kind==='com'){
          o._Release();
        }
      };
      return Result;
    };
    this.Equals = function (Obj) {
      var Result = false;
      Result = Obj === this;
      return Result;
    };
    this.ToString = function () {
      var Result = "";
      Result = this.$classname;
      return Result;
    };
  });
  rtl.createClass(this,"TCustomAttribute",this.TObject,function () {
  });
  this.$rtti.$ClassRef("TCustomAttributeClass",{instancetype: this.$rtti["TCustomAttribute"]});
  this.$rtti.$DynArray("TCustomAttributeArray",{eltype: this.$rtti["TCustomAttribute"]});
  this.S_OK = 0;
  this.S_FALSE = 1;
  this.E_NOINTERFACE = -2147467262;
  this.E_UNEXPECTED = -2147418113;
  this.E_NOTIMPL = -2147467263;
  rtl.createInterface(this,"IUnknown","{00000000-0000-0000-C000-000000000046}",["QueryInterface","_AddRef","_Release"],null,function () {
    this.$kind = "com";
    var $r = this.$rtti;
    $r.addMethod("QueryInterface",1,[["iid",$mod.$rtti["TGuid"],2],["obj",null,4]],rtl.longint);
    $r.addMethod("_AddRef",1,[],rtl.longint);
    $r.addMethod("_Release",1,[],rtl.longint);
  });
  rtl.createInterface(this,"IInvokable","{88387EF6-BCEE-3E17-9E85-5D491ED4FC10}",[],this.IUnknown,function () {
  });
  rtl.createInterface(this,"IEnumerator","{ECEC7568-4E50-30C9-A2F0-439342DE2ADB}",["GetCurrent","MoveNext","Reset"],this.IUnknown,function () {
    var $r = this.$rtti;
    $r.addMethod("GetCurrent",1,[],$mod.$rtti["TObject"]);
    $r.addMethod("MoveNext",1,[],rtl.boolean);
    $r.addMethod("Reset",0,[]);
    $r.addProperty("Current",1,$mod.$rtti["TObject"],"GetCurrent","");
  });
  rtl.createInterface(this,"IEnumerable","{9791C368-4E51-3424-A3CE-D4911D54F385}",["GetEnumerator"],this.IUnknown,function () {
    var $r = this.$rtti;
    $r.addMethod("GetEnumerator",1,[],$mod.$rtti["IEnumerator"]);
  });
  rtl.createClass(this,"TInterfacedObject",this.TObject,function () {
    this.$init = function () {
      $mod.TObject.$init.call(this);
      this.fRefCount = 0;
    };
    this.QueryInterface = function (iid, obj) {
      var Result = 0;
      if (this.GetInterface(iid,obj)) {
        Result = 0}
       else Result = -2147467262;
      return Result;
    };
    this._AddRef = function () {
      var Result = 0;
      this.fRefCount += 1;
      Result = this.fRefCount;
      return Result;
    };
    this._Release = function () {
      var Result = 0;
      this.fRefCount -= 1;
      Result = this.fRefCount;
      if (this.fRefCount === 0) this.$destroy("Destroy");
      return Result;
    };
    this.BeforeDestruction = function () {
      if (this.fRefCount !== 0) rtl.raiseE('EHeapMemoryError');
    };
    rtl.addIntf(this,$mod.IUnknown);
  });
  this.$rtti.$ClassRef("TInterfacedClass",{instancetype: this.$rtti["TInterfacedObject"]});
  rtl.createClass(this,"TAggregatedObject",this.TObject,function () {
    this.$init = function () {
      $mod.TObject.$init.call(this);
      this.fController = null;
    };
    this.GetController = function () {
      var Result = null;
      var $ok = false;
      try {
        Result = rtl.setIntfL(Result,this.fController);
        $ok = true;
      } finally {
        if (!$ok) rtl._Release(Result);
      };
      return Result;
    };
    this.QueryInterface = function (iid, obj) {
      var Result = 0;
      Result = this.fController.QueryInterface(iid,obj);
      return Result;
    };
    this._AddRef = function () {
      var Result = 0;
      Result = this.fController._AddRef();
      return Result;
    };
    this._Release = function () {
      var Result = 0;
      Result = this.fController._Release();
      return Result;
    };
    this.Create$1 = function (aController) {
      $mod.TObject.Create.call(this);
      this.fController = aController;
      return this;
    };
  });
  rtl.createClass(this,"TContainedObject",this.TAggregatedObject,function () {
    this.QueryInterface = function (iid, obj) {
      var Result = 0;
      if (this.GetInterface(iid,obj)) {
        Result = 0}
       else Result = -2147467262;
      return Result;
    };
    rtl.addIntf(this,$mod.IUnknown);
  });
  this.IObjectInstance = this.TGuid.$clone({D1: 0xD91C9AF4, D2: 0x3C93, D3: 0x420F, D4: [0xA3,0x03,0xBF,0x5B,0xA8,0x2B,0xFD,0x23]});
  this.TTypeKind = {"0": "tkUnknown", tkUnknown: 0, "1": "tkInteger", tkInteger: 1, "2": "tkChar", tkChar: 2, "3": "tkString", tkString: 3, "4": "tkEnumeration", tkEnumeration: 4, "5": "tkSet", tkSet: 5, "6": "tkDouble", tkDouble: 6, "7": "tkBool", tkBool: 7, "8": "tkProcVar", tkProcVar: 8, "9": "tkMethod", tkMethod: 9, "10": "tkArray", tkArray: 10, "11": "tkDynArray", tkDynArray: 11, "12": "tkRecord", tkRecord: 12, "13": "tkClass", tkClass: 13, "14": "tkClassRef", tkClassRef: 14, "15": "tkPointer", tkPointer: 15, "16": "tkJSValue", tkJSValue: 16, "17": "tkRefToProcVar", tkRefToProcVar: 17, "18": "tkInterface", tkInterface: 18, "19": "tkHelper", tkHelper: 19, "20": "tkExtClass", tkExtClass: 20};
  this.$rtti.$Enum("TTypeKind",{minvalue: 0, maxvalue: 20, ordtype: 1, enumtype: this.TTypeKind});
  this.$rtti.$Set("TTypeKinds",{comptype: this.$rtti["TTypeKind"]});
  this.tkFloat = this.TTypeKind.tkDouble;
  this.tkProcedure = this.TTypeKind.tkProcVar;
  this.tkAny = rtl.createSet(null,this.TTypeKind.tkUnknown,this.TTypeKind.tkExtClass);
  this.tkMethods = rtl.createSet(this.TTypeKind.tkMethod);
  this.tkProperties = rtl.diffSet(rtl.diffSet(this.tkAny,this.tkMethods),rtl.createSet(this.TTypeKind.tkUnknown));
  this.vtInteger = 0;
  this.vtBoolean = 1;
  this.vtExtended = 3;
  this.vtPointer = 5;
  this.vtObject = 7;
  this.vtClass = 8;
  this.vtWideChar = 9;
  this.vtCurrency = 12;
  this.vtInterface = 14;
  this.vtUnicodeString = 18;
  this.vtNativeInt = 19;
  this.vtJSValue = 20;
  this.$rtti.$Pointer("PVarRec",{reftype: this.$rtti["TVarRec"]});
  rtl.recNewT(this,"TVarRec",function () {
    this.VType = 0;
    this.VJSValue = undefined;
    this.$eq = function (b) {
      return (this.VType === b.VType) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue);
    };
    this.$assign = function (s) {
      this.VType = s.VType;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      this.VJSValue = s.VJSValue;
      return this;
    };
    var $r = $mod.$rtti.$Record("TVarRec",{});
    $r.addField("VType",rtl.byte);
    $r.addField("VJSValue",rtl.jsvalue);
    $r.addField("VJSValue",rtl.longint);
    $r.addField("VJSValue",rtl.boolean);
    $r.addField("VJSValue",rtl.double);
    $r.addField("VJSValue",rtl.pointer);
    $r.addField("VJSValue",$mod.$rtti["TObject"]);
    $r.addField("VJSValue",$mod.$rtti["TClass"]);
    $r.addField("VJSValue",rtl.char);
    $r.addField("VJSValue",rtl.nativeint);
    $r.addField("VJSValue",rtl.pointer);
    $r.addField("VJSValue",$mod.$rtti["UnicodeString"]);
    $r.addField("VJSValue",rtl.nativeint);
  });
  this.$rtti.$DynArray("TVarRecArray",{eltype: this.$rtti["TVarRec"]});
  this.VarRecs = function () {
    var Result = [];
    var i = 0;
    var v = null;
    Result = [];
    while (i < arguments.length) {
      v = $mod.TVarRec.$new();
      v.VType = rtl.trunc(arguments[i]);
      i += 1;
      v.VJSValue = arguments[i];
      i += 1;
      Result.push($mod.TVarRec.$clone(v));
    };
    return Result;
  };
  this.IsConsole = false;
  this.FirstDotAtFileNameStartIsExtension = false;
  this.$rtti.$ProcVar("TOnParamCount",{procsig: rtl.newTIProcSig([],rtl.longint)});
  this.$rtti.$ProcVar("TOnParamStr",{procsig: rtl.newTIProcSig([["Index",rtl.longint]],rtl.string)});
  this.OnParamCount = null;
  this.OnParamStr = null;
  this.ParamCount = function () {
    var Result = 0;
    if ($mod.OnParamCount != null) {
      Result = $mod.OnParamCount()}
     else Result = 0;
    return Result;
  };
  this.ParamStr = function (Index) {
    var Result = "";
    if ($mod.OnParamStr != null) {
      Result = $mod.OnParamStr(Index)}
     else if (Index === 0) {
      Result = "js"}
     else Result = "";
    return Result;
  };
  this.Frac = function (A) {
    return A % 1;
  };
  this.Odd = function (A) {
    return A&1 != 0;
  };
  this.Random = function (Range) {
    return Math.floor(Math.random()*Range);
  };
  this.Sqr = function (A) {
    return A*A;
  };
  this.Sqr$1 = function (A) {
    return A*A;
  };
  this.Trunc = function (A) {
    if (!Math.trunc) {
      Math.trunc = function(v) {
        v = +v;
        if (!isFinite(v)) return v;
        return (v - v % 1) || (v < 0 ? -0 : v === 0 ? v : 0);
      };
    }
    $mod.Trunc = Math.trunc;
    return Math.trunc(A);
  };
  this.DefaultTextLineBreakStyle = this.TTextLineBreakStyle.tlbsLF;
  this.Int = function (A) {
    var Result = 0.0;
    Result = $mod.Trunc(A);
    return Result;
  };
  this.Copy = function (S, Index, Size) {
    if (Index<1) Index = 1;
    return (Size>0) ? S.substring(Index-1,Index+Size-1) : "";
  };
  this.Copy$1 = function (S, Index) {
    if (Index<1) Index = 1;
    return S.substr(Index-1);
  };
  this.Delete = function (S, Index, Size) {
    var h = "";
    if ((Index < 1) || (Index > S.get().length) || (Size <= 0)) return;
    h = S.get();
    S.set($mod.Copy(h,1,Index - 1) + $mod.Copy$1(h,Index + Size));
  };
  this.Pos = function (Search, InString) {
    return InString.indexOf(Search)+1;
  };
  this.Pos$1 = function (Search, InString, StartAt) {
    return InString.indexOf(Search,StartAt-1)+1;
  };
  this.Insert = function (Insertion, Target, Index) {
    var t = "";
    if (Insertion === "") return;
    t = Target.get();
    if (Index < 1) {
      Target.set(Insertion + t)}
     else if (Index > t.length) {
      Target.set(t + Insertion)}
     else Target.set($mod.Copy(t,1,Index - 1) + Insertion + $mod.Copy(t,Index,t.length));
  };
  this.upcase = function (c) {
    return c.toUpperCase();
  };
  this.binstr = function (val, cnt) {
    var Result = "";
    var i = 0;
    Result = rtl.strSetLength(Result,cnt);
    for (var $l = cnt; $l >= 1; $l--) {
      i = $l;
      Result = rtl.setCharAt(Result,i - 1,String.fromCharCode(48 + (val & 1)));
      val = Math.floor(val / 2);
    };
    return Result;
  };
  this.val = function (S, NI, Code) {
    NI.set($impl.valint(S,-9007199254740991,9007199254740991,Code));
  };
  this.val$1 = function (S, NI, Code) {
    var x = 0.0;
    if (S === "") {
      Code.set(1);
      return;
    };
    x = Number(S);
    if (isNaN(x) || (x !== $mod.Int(x)) || (x < 0)) {
      Code.set(1)}
     else {
      Code.set(0);
      NI.set($mod.Trunc(x));
    };
  };
  this.val$2 = function (S, SI, Code) {
    SI.set($impl.valint(S,-128,127,Code));
  };
  this.val$3 = function (S, B, Code) {
    B.set($impl.valint(S,0,255,Code));
  };
  this.val$4 = function (S, SI, Code) {
    SI.set($impl.valint(S,-32768,32767,Code));
  };
  this.val$5 = function (S, W, Code) {
    W.set($impl.valint(S,0,65535,Code));
  };
  this.val$6 = function (S, I, Code) {
    I.set($impl.valint(S,-2147483648,2147483647,Code));
  };
  this.val$7 = function (S, C, Code) {
    C.set($impl.valint(S,0,4294967295,Code));
  };
  this.val$8 = function (S, d, Code) {
    var x = 0.0;
    if (S === "") {
      Code.set(1);
      return;
    };
    x = Number(S);
    if (isNaN(x)) {
      Code.set(1)}
     else {
      Code.set(0);
      d.set(x);
    };
  };
  this.val$9 = function (S, b, Code) {
    if ($impl.SameText(S,"true")) {
      Code.set(0);
      b.set(true);
    } else if ($impl.SameText(S,"false")) {
      Code.set(0);
      b.set(false);
    } else Code.set(1);
  };
  this.StringOfChar = function (c, l) {
    var Result = "";
    var i = 0;
    if ((l>0) && c.repeat) return c.repeat(l);
    Result = "";
    for (var $l = 1, $end = l; $l <= $end; $l++) {
      i = $l;
      Result = Result + c;
    };
    return Result;
  };
  this.Write = function () {
    var i = 0;
    for (var $l = 0, $end = arguments.length - 1; $l <= $end; $l++) {
      i = $l;
      if ($impl.WriteCallBack != null) {
        $impl.WriteCallBack(arguments[i],false)}
       else $impl.WriteBuf = $impl.WriteBuf + ("" + arguments[i]);
    };
  };
  this.Writeln = function () {
    var i = 0;
    var l = 0;
    var s = "";
    l = arguments.length - 1;
    if ($impl.WriteCallBack != null) {
      for (var $l = 0, $end = l; $l <= $end; $l++) {
        i = $l;
        $impl.WriteCallBack(arguments[i],i === l);
      };
    } else {
      s = $impl.WriteBuf;
      for (var $l1 = 0, $end1 = l; $l1 <= $end1; $l1++) {
        i = $l1;
        s = s + ("" + arguments[i]);
      };
      console.log(s);
      $impl.WriteBuf = "";
    };
  };
  this.$rtti.$RefToProcVar("TConsoleHandler",{procsig: rtl.newTIProcSig([["S",rtl.jsvalue],["NewLine",rtl.boolean]])});
  this.SetWriteCallBack = function (H) {
    var Result = null;
    Result = $impl.WriteCallBack;
    $impl.WriteCallBack = H;
    return Result;
  };
  this.Assigned = function (V) {
    return (V!=undefined) && (V!=null) && (!rtl.isArray(V) || (V.length > 0));
  };
  this.StrictEqual = function (A, B) {
    return A === B;
  };
  this.StrictInequal = function (A, B) {
    return A !== B;
  };
  $mod.$implcode = function () {
    $impl.SameText = function (s1, s2) {
      return s1.toLowerCase() == s2.toLowerCase();
    };
    $impl.WriteBuf = "";
    $impl.WriteCallBack = null;
    $impl.valint = function (S, MinVal, MaxVal, Code) {
      var Result = 0;
      var x = 0.0;
      if (S === "") {
        Code.set(1);
        return Result;
      };
      x = Number(S);
      if (isNaN(x)) {
        var $tmp = $mod.Copy(S,1,1);
        if ($tmp === "$") {
          x = Number("0x" + $mod.Copy$1(S,2))}
         else if ($tmp === "&") {
          x = Number("0o" + $mod.Copy$1(S,2))}
         else if ($tmp === "%") {
          x = Number("0b" + $mod.Copy$1(S,2))}
         else {
          Code.set(1);
          return Result;
        };
      };
      if (isNaN(x) || (x !== $mod.Int(x))) {
        Code.set(1)}
       else if ((x < MinVal) || (x > MaxVal)) {
        Code.set(2)}
       else {
        Result = $mod.Trunc(x);
        Code.set(0);
      };
      return Result;
    };
  };
  $mod.$init = function () {
    rtl.exitcode = 0;
  };
},[]);
rtl.module("Types",["System"],function () {
  "use strict";
  var $mod = this;
  this.TDirection = {"0": "FromBeginning", FromBeginning: 0, "1": "FromEnd", FromEnd: 1};
  this.$rtti.$Enum("TDirection",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TDirection});
  this.$rtti.$DynArray("TBooleanDynArray",{eltype: rtl.boolean});
  this.$rtti.$DynArray("TWordDynArray",{eltype: rtl.word});
  this.$rtti.$DynArray("TIntegerDynArray",{eltype: rtl.longint});
  this.$rtti.$DynArray("TNativeIntDynArray",{eltype: rtl.nativeint});
  this.$rtti.$DynArray("TStringDynArray",{eltype: rtl.string});
  this.$rtti.$DynArray("TDoubleDynArray",{eltype: rtl.double});
  this.$rtti.$DynArray("TJSValueDynArray",{eltype: rtl.jsvalue});
  this.$rtti.$DynArray("TObjectDynArray",{eltype: pas.System.$rtti["TObject"]});
  this.$rtti.$DynArray("TByteDynArray",{eltype: rtl.byte});
  this.TDuplicates = {"0": "dupIgnore", dupIgnore: 0, "1": "dupAccept", dupAccept: 1, "2": "dupError", dupError: 2};
  this.$rtti.$Enum("TDuplicates",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TDuplicates});
  this.$rtti.$RefToProcVar("TProc",{procsig: rtl.newTIProcSig([])});
  this.$rtti.$RefToProcVar("TProcString",{procsig: rtl.newTIProcSig([["aString",rtl.string,2]])});
  this.$rtti.$MethodVar("TListCallback",{procsig: rtl.newTIProcSig([["data",rtl.jsvalue],["arg",rtl.jsvalue]]), methodkind: 0});
  this.$rtti.$ProcVar("TListStaticCallback",{procsig: rtl.newTIProcSig([["data",rtl.jsvalue],["arg",rtl.jsvalue]])});
  rtl.recNewT(this,"TSize",function () {
    this.cx = 0;
    this.cy = 0;
    this.$eq = function (b) {
      return (this.cx === b.cx) && (this.cy === b.cy);
    };
    this.$assign = function (s) {
      this.cx = s.cx;
      this.cy = s.cy;
      return this;
    };
    var $r = $mod.$rtti.$Record("TSize",{});
    $r.addField("cx",rtl.longint);
    $r.addField("cy",rtl.longint);
  });
  rtl.recNewT(this,"TPoint",function () {
    this.x = 0;
    this.y = 0;
    this.$eq = function (b) {
      return (this.x === b.x) && (this.y === b.y);
    };
    this.$assign = function (s) {
      this.x = s.x;
      this.y = s.y;
      return this;
    };
    var $r = $mod.$rtti.$Record("TPoint",{});
    $r.addField("x",rtl.longint);
    $r.addField("y",rtl.longint);
  });
  rtl.recNewT(this,"TRect",function () {
    this.Left = 0;
    this.Top = 0;
    this.Right = 0;
    this.Bottom = 0;
    this.$eq = function (b) {
      return (this.Left === b.Left) && (this.Top === b.Top) && (this.Right === b.Right) && (this.Bottom === b.Bottom);
    };
    this.$assign = function (s) {
      this.Left = s.Left;
      this.Top = s.Top;
      this.Right = s.Right;
      this.Bottom = s.Bottom;
      return this;
    };
    var $r = $mod.$rtti.$Record("TRect",{});
    $r.addField("Left",rtl.longint);
    $r.addField("Top",rtl.longint);
    $r.addField("Right",rtl.longint);
    $r.addField("Bottom",rtl.longint);
  });
  this.EqualRect = function (r1, r2) {
    var Result = false;
    Result = (r1.Left === r2.Left) && (r1.Right === r2.Right) && (r1.Top === r2.Top) && (r1.Bottom === r2.Bottom);
    return Result;
  };
  this.Rect = function (Left, Top, Right, Bottom) {
    var Result = $mod.TRect.$new();
    Result.Left = Left;
    Result.Top = Top;
    Result.Right = Right;
    Result.Bottom = Bottom;
    return Result;
  };
  this.Bounds = function (ALeft, ATop, AWidth, AHeight) {
    var Result = $mod.TRect.$new();
    Result.Left = ALeft;
    Result.Top = ATop;
    Result.Right = ALeft + AWidth;
    Result.Bottom = ATop + AHeight;
    return Result;
  };
  this.Point = function (x, y) {
    var Result = $mod.TPoint.$new();
    Result.x = x;
    Result.y = y;
    return Result;
  };
  this.PtInRect = function (aRect, p) {
    var Result = false;
    Result = (p.y >= aRect.Top) && (p.y < aRect.Bottom) && (p.x >= aRect.Left) && (p.x < aRect.Right);
    return Result;
  };
  this.IntersectRect = function (aRect, R1, R2) {
    var Result = false;
    var lRect = $mod.TRect.$new();
    lRect.$assign(R1);
    if (R2.Left > R1.Left) lRect.Left = R2.Left;
    if (R2.Top > R1.Top) lRect.Top = R2.Top;
    if (R2.Right < R1.Right) lRect.Right = R2.Right;
    if (R2.Bottom < R1.Bottom) lRect.Bottom = R2.Bottom;
    if ($mod.IsRectEmpty(lRect)) {
      aRect.$assign($mod.Rect(0,0,0,0));
      Result = false;
    } else {
      Result = true;
      aRect.$assign(lRect);
    };
    return Result;
  };
  this.UnionRect = function (aRect, R1, R2) {
    var Result = false;
    var lRect = $mod.TRect.$new();
    lRect.$assign(R1);
    if (R2.Left < R1.Left) lRect.Left = R2.Left;
    if (R2.Top < R1.Top) lRect.Top = R2.Top;
    if (R2.Right > R1.Right) lRect.Right = R2.Right;
    if (R2.Bottom > R1.Bottom) lRect.Bottom = R2.Bottom;
    if ($mod.IsRectEmpty(lRect)) {
      aRect.$assign($mod.Rect(0,0,0,0));
      Result = false;
    } else {
      aRect.$assign(lRect);
      Result = true;
    };
    return Result;
  };
  this.IsRectEmpty = function (aRect) {
    var Result = false;
    Result = (aRect.Right <= aRect.Left) || (aRect.Bottom <= aRect.Top);
    return Result;
  };
  this.OffsetRect = function (aRect, DX, DY) {
    var Result = false;
    aRect.Left += DX;
    aRect.Top += DY;
    aRect.Right += DX;
    aRect.Bottom += DY;
    Result = true;
    return Result;
  };
  this.CenterPoint = function (aRect) {
    var Result = $mod.TPoint.$new();
    function Avg(a, b) {
      var Result = 0;
      if (a < b) {
        Result = a + ((b - a) >>> 1)}
       else Result = b + ((a - b) >>> 1);
      return Result;
    };
    Result.x = Avg(aRect.Left,aRect.Right);
    Result.y = Avg(aRect.Top,aRect.Bottom);
    return Result;
  };
  this.InflateRect = function (aRect, dx, dy) {
    var Result = false;
    aRect.Left -= dx;
    aRect.Top -= dy;
    aRect.Right += dx;
    aRect.Bottom += dy;
    Result = true;
    return Result;
  };
  this.Size = function (AWidth, AHeight) {
    var Result = $mod.TSize.$new();
    Result.cx = AWidth;
    Result.cy = AHeight;
    return Result;
  };
  this.Size$1 = function (aRect) {
    var Result = $mod.TSize.$new();
    Result.cx = aRect.Right - aRect.Left;
    Result.cy = aRect.Bottom - aRect.Top;
    return Result;
  };
});
rtl.module("JS",["System","Types"],function () {
  "use strict";
  var $mod = this;
  this.$rtti.$ExtClass("TJSArray");
  this.$rtti.$ExtClass("TJSMap");
  rtl.createClass(this,"EJS",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FMessage = "";
    };
    this.Create$1 = function (Msg) {
      this.FMessage = Msg;
      return this;
    };
  });
  this.$rtti.$ExtClass("TJSObject",{jsclass: "Object"});
  this.$rtti.$ClassRef("TJSObjectClass",{instancetype: this.$rtti["TJSObject"]});
  this.$rtti.$DynArray("TJSObjectDynArray",{eltype: this.$rtti["TJSObject"]});
  this.$rtti.$DynArray("TJSObjectDynArrayArray",{eltype: this.$rtti["TJSObjectDynArray"]});
  this.$rtti.$DynArray("TJSStringDynArray",{eltype: rtl.string});
  this.$rtti.$ExtClass("TJSIteratorValue",{jsclass: "IteratorValue"});
  this.$rtti.$ExtClass("TJSIterator",{jsclass: "Iterator"});
  this.$rtti.$ExtClass("TJSSet");
  this.$rtti.$RefToProcVar("TJSSetEventProc",{procsig: rtl.newTIProcSig([["value",rtl.jsvalue],["key",rtl.nativeint],["set_",this.$rtti["TJSSet"]]])});
  this.$rtti.$RefToProcVar("TJSSetProcCallBack",{procsig: rtl.newTIProcSig([["value",rtl.jsvalue],["key",rtl.jsvalue]])});
  this.$rtti.$ExtClass("TJSSet",{jsclass: "Set"});
  this.$rtti.$RefToProcVar("TJSMapFunctionCallBack",{procsig: rtl.newTIProcSig([["arg",rtl.jsvalue]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSMapProcCallBack",{procsig: rtl.newTIProcSig([["value",rtl.jsvalue],["key",rtl.jsvalue]])});
  this.$rtti.$ExtClass("TJSMap",{jsclass: "Map"});
  this.$rtti.$ExtClass("TJSFunction",{ancestor: this.$rtti["TJSObject"], jsclass: "Function"});
  this.$rtti.$ExtClass("TJSDate",{ancestor: this.$rtti["TJSFunction"], jsclass: "Date"});
  this.$rtti.$ExtClass("TJSSymbol",{ancestor: this.$rtti["TJSFunction"], jsclass: "Symbol"});
  rtl.recNewT(this,"TLocaleCompareOptions",function () {
    this.localematched = "";
    this.usage = "";
    this.sensitivity = "";
    this.ignorePunctuation = false;
    this.numeric = false;
    this.caseFirst = "";
    this.$eq = function (b) {
      return (this.localematched === b.localematched) && (this.usage === b.usage) && (this.sensitivity === b.sensitivity) && (this.ignorePunctuation === b.ignorePunctuation) && (this.numeric === b.numeric) && (this.caseFirst === b.caseFirst);
    };
    this.$assign = function (s) {
      this.localematched = s.localematched;
      this.usage = s.usage;
      this.sensitivity = s.sensitivity;
      this.ignorePunctuation = s.ignorePunctuation;
      this.numeric = s.numeric;
      this.caseFirst = s.caseFirst;
      return this;
    };
    var $r = $mod.$rtti.$Record("TLocaleCompareOptions",{});
    $r.addField("localematched",rtl.string);
    $r.addField("usage",rtl.string);
    $r.addField("sensitivity",rtl.string);
    $r.addField("ignorePunctuation",rtl.boolean);
    $r.addField("numeric",rtl.boolean);
    $r.addField("caseFirst",rtl.string);
  });
  this.$rtti.$ExtClass("TJSRegexp",{jsclass: "RegExp"});
  this.$rtti.$RefToProcVar("TReplaceCallBack",{procsig: rtl.newTIProcSig([["match",rtl.string,2]],rtl.string,2)});
  this.$rtti.$RefToProcVar("TReplaceCallBack0",{procsig: rtl.newTIProcSig([["match",rtl.string,2],["offset",rtl.longint],["AString",rtl.string]],rtl.string)});
  this.$rtti.$RefToProcVar("TReplaceCallBack1",{procsig: rtl.newTIProcSig([["match",rtl.string,2],["p1",rtl.string,2],["offset",rtl.longint],["AString",rtl.string]],rtl.string)});
  this.$rtti.$RefToProcVar("TReplaceCallBack2",{procsig: rtl.newTIProcSig([["match",rtl.string,2],["p1",rtl.string,2],["p2",rtl.string,2],["offset",rtl.longint],["AString",rtl.string]],rtl.string)});
  this.$rtti.$ExtClass("TJSString",{jsclass: "String"});
  this.$rtti.$RefToProcVar("TJSArrayEventProc",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]])});
  this.$rtti.$RefToProcVar("TJSArrayEvent",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]],rtl.boolean)});
  this.$rtti.$RefToProcVar("TJSArrayMapEvent",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSArrayReduceEvent",{procsig: rtl.newTIProcSig([["accumulator",rtl.jsvalue],["currentValue",rtl.jsvalue],["currentIndex",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSArrayCompareEvent",{procsig: rtl.newTIProcSig([["a",rtl.jsvalue],["b",rtl.jsvalue]],rtl.nativeint)});
  this.$rtti.$ExtClass("TJSArray",{jsclass: "Array"});
  this.$rtti.$ExtClass("TJSArrayBuffer",{ancestor: this.$rtti["TJSObject"], jsclass: "ArrayBuffer"});
  this.$rtti.$ExtClass("TJSBufferSource",{ancestor: this.$rtti["TJSObject"], jsclass: "BufferSource"});
  this.$rtti.$ExtClass("TJSTypedArray");
  this.$rtti.$RefToProcVar("TJSTypedArrayCallBack",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSTypedArray"]]],rtl.boolean)});
  this.$rtti.$RefToProcVar("TJSTypedArrayMapCallBack",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSTypedArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSTypedArrayReduceCallBack",{procsig: rtl.newTIProcSig([["accumulator",rtl.jsvalue],["currentValue",rtl.jsvalue],["currentIndex",rtl.nativeint],["anArray",this.$rtti["TJSTypedArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSTypedArrayCompareCallBack",{procsig: rtl.newTIProcSig([["a",rtl.jsvalue],["b",rtl.jsvalue]],rtl.nativeint)});
  this.$rtti.$ExtClass("TJSTypedArray",{ancestor: this.$rtti["TJSBufferSource"], jsclass: "TypedArray"});
  this.$rtti.$ExtClass("TJSInt8Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Int8Array"});
  this.$rtti.$ExtClass("TJSUint8Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint8Array"});
  this.$rtti.$ExtClass("TJSUint8ClampedArray",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint8ClampedArray"});
  this.$rtti.$ExtClass("TJSInt16Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Int16Array"});
  this.$rtti.$ExtClass("TJSUint16Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint16Array"});
  this.$rtti.$ExtClass("TJSInt32Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Int32Array"});
  this.$rtti.$ExtClass("TJSUint32Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint32Array"});
  this.$rtti.$ExtClass("TJSFloat32Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Float32Array"});
  this.$rtti.$ExtClass("TJSFloat64Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Float64Array"});
  this.$rtti.$ExtClass("TJSDataView",{ancestor: this.$rtti["TJSBufferSource"], jsclass: "DataView"});
  this.$rtti.$ExtClass("TJSJSON",{ancestor: this.$rtti["TJSObject"], jsclass: "JSON"});
  this.$rtti.$ExtClass("TJSError",{ancestor: this.$rtti["TJSObject"], jsclass: "Error"});
  this.$rtti.$RefToProcVar("TJSPromiseResolver",{procsig: rtl.newTIProcSig([["aValue",rtl.jsvalue]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSPromiseExecutor",{procsig: rtl.newTIProcSig([["resolve",this.$rtti["TJSPromiseResolver"]],["reject",this.$rtti["TJSPromiseResolver"]]])});
  this.$rtti.$RefToProcVar("TJSPromiseFinallyHandler",{procsig: rtl.newTIProcSig([])});
  this.$rtti.$ExtClass("TJSPromise");
  this.$rtti.$ExtClass("TJSPromise",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TJSFunctionArguments",{jsclass: "arguments"});
  this.$rtti.$ExtClass("TJSIteratorResult",{ancestor: this.$rtti["TJSObject"], jsclass: "IteratorResult"});
  this.$rtti.$ExtClass("TJSAsyncIterator",{ancestor: this.$rtti["TJSObject"], jsclass: "AsyncIterator"});
  this.$rtti.$ExtClass("TJSSyntaxError",{ancestor: this.$rtti["TJSError"], jsclass: "SyntaxError"});
  this.$rtti.$ExtClass("TJSTextDecoderOptions",{ancestor: this.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSTextDecodeOptions",{ancestor: this.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSTextDecoder",{ancestor: this.$rtti["TJSObject"], jsclass: "TextDecoder"});
  this.$rtti.$ExtClass("TJSTextEncoderEncodeIntoResult",{ancestor: this.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSTextEncoder",{ancestor: this.$rtti["TJSObject"], jsclass: "TextEncoder"});
  this.$rtti.$ExtClass("TGGenerator<System.JSValue>",{ancestor: this.$rtti["TJSObject"], jsclass: "Generator"});
  this.$rtti.$ExtClass("TJSProxy",{ancestor: this.$rtti["TJSObject"], jsclass: "Proxy"});
  this.$rtti.$ExtClass("TJSNumber",{ancestor: this.$rtti["TJSFunction"], jsclass: "Number"});
  this.$rtti.$ExtClass("TJSBigInt",{ancestor: this.$rtti["TJSObject"], jsclass: "BigInt"});
  this.Symbol$1 = function () {
    return Symbol();
  };
  this.Symbol$2 = function (Description) {
    return Symbol(Description);
  };
  this.AsNumber = function (v) {
    return Number(v);
  };
  this.AsIntNumber = function (v) {
    return Number(v);
  };
  this.JSValueArrayOf = function (Args) {
    var Result = [];
    var I = 0;
    Result = rtl.arraySetLength(Result,undefined,rtl.length(Args));
    for (var $l = 0, $end = rtl.length(Args) - 1; $l <= $end; $l++) {
      I = $l;
      Result[I] = Args[I].VJSValue;
    };
    return Result;
  };
  this.New = function (aElements) {
    var Result = null;
    var L = 0;
    var I = 0;
    var S = "";
    L = rtl.length(aElements);
    if ((L % 2) === 1) throw $mod.EJS.$create("Create$1",["Number of arguments must be even"]);
    I = 0;
    while (I < L) {
      if (!rtl.isString(aElements[I])) {
        S = String(I);
        throw $mod.EJS.$create("Create$1",["Argument " + S + " must be a string."]);
      };
      I += 2;
    };
    I = 0;
    Result = new Object();
    while (I < L) {
      S = "" + aElements[I];
      Result[S] = aElements[I + 1];
      I += 2;
    };
    return Result;
  };
  this.JSDelete = function (Obj, PropName) {
    return delete Obj[PropName];
  };
  this.hasValue = function (v) {
    if(v){ return true; } else { return false; };
  };
  this.jsIn = function (keyName, object) {
    return keyName in object;
  };
  this.isBoolean = function (v) {
    return typeof(v) == 'boolean';
  };
  this.isDate = function (v) {
    return (v instanceof Date);
  };
  this.isCallback = function (v) {
    return rtl.isObject(v) && rtl.isObject(v.scope) && (rtl.isString(v.fn) || rtl.isFunction(v.fn));
  };
  this.isChar = function (v) {
    return (typeof(v)!="string") && (v.length==1);
  };
  this.isClass = function (v) {
    return (typeof(v)=="object") && (v!=null) && (v.$class == v);
  };
  this.isClassInstance = function (v) {
    return (typeof(v)=="object") && (v!=null) && (v.$class == Object.getPrototypeOf(v));
  };
  this.isInteger = function (v) {
    return Math.floor(v)===v;
  };
  this.isNull = function (v) {
    return v === null;
  };
  this.isRecord = function (v) {
    return (typeof(v)==="object")
    && (typeof(v.$new)==="function")
    && (typeof(v.$clone)==="function")
    && (typeof(v.$eq)==="function")
    && (typeof(v.$assign)==="function");
  };
  this.isBigint = function (v) {
    return typeof(v) === 'bigint';
  };
  this.isUndefined = function (v) {
    return v == undefined;
  };
  this.isDefined = function (v) {
    return !(v == undefined);
  };
  this.isUTF16Char = function (v) {
    if (typeof(v)!="string") return false;
    if ((v.length==0) || (v.length>2)) return false;
    var code = v.charCodeAt(0);
    if (code < 0xD800){
      if (v.length == 1) return true;
    } else if (code <= 0xDBFF){
      if (v.length==2){
        code = v.charCodeAt(1);
        if (code >= 0xDC00 && code <= 0xDFFF) return true;
      };
    };
    return false;
  };
  this.jsInstanceOf = function (aFunction, aFunctionWithPrototype) {
    return aFunction instanceof aFunctionWithPrototype;
  };
  this.toNumber = function (v) {
    return v-0;
  };
  this.toInteger = function (v) {
    var Result = 0;
    if ($mod.isInteger(v)) {
      Result = rtl.trunc(v)}
     else Result = 0;
    return Result;
  };
  this.toObject = function (Value) {
    var Result = null;
    if (rtl.isObject(Value)) {
      Result = Value}
     else Result = null;
    return Result;
  };
  this.toArray = function (Value) {
    var Result = null;
    if (rtl.isArray(Value)) {
      Result = Value}
     else Result = null;
    return Result;
  };
  this.toBoolean = function (Value) {
    var Result = false;
    if ($mod.isBoolean(Value)) {
      Result = !(Value == false)}
     else Result = false;
    return Result;
  };
  this.ToString = function (Value) {
    var Result = "";
    if (rtl.isString(Value)) {
      Result = "" + Value}
     else Result = "";
    return Result;
  };
  this.TJSValueType = {"0": "jvtNull", jvtNull: 0, "1": "jvtBoolean", jvtBoolean: 1, "2": "jvtInteger", jvtInteger: 2, "3": "jvtFloat", jvtFloat: 3, "4": "jvtString", jvtString: 4, "5": "jvtObject", jvtObject: 5, "6": "jvtArray", jvtArray: 6};
  this.$rtti.$Enum("TJSValueType",{minvalue: 0, maxvalue: 6, ordtype: 1, enumtype: this.TJSValueType});
  this.GetValueType = function (JS) {
    var Result = 0;
    var t = "";
    if ($mod.isNull(JS)) {
      Result = $mod.TJSValueType.jvtNull}
     else {
      t = typeof(JS);
      if (t === "string") {
        Result = $mod.TJSValueType.jvtString}
       else if (t === "boolean") {
        Result = $mod.TJSValueType.jvtBoolean}
       else if (t === "object") {
        if (rtl.isArray(JS)) {
          Result = $mod.TJSValueType.jvtArray}
         else Result = $mod.TJSValueType.jvtObject;
      } else if (t === "number") if ($mod.isInteger(JS)) {
        Result = $mod.TJSValueType.jvtInteger}
       else Result = $mod.TJSValueType.jvtFloat;
    };
    return Result;
  };
});
rtl.module("weborworker",["System","JS","Types"],function () {
  "use strict";
  var $mod = this;
  this.$rtti.$ExtClass("TJSCryptoKey");
  this.$rtti.$ExtClass("TJSSubtleCrypto");
  this.$rtti.$ExtClass("TJSEventTarget");
  this.$rtti.$ExtClass("TIDBDatabase");
  this.$rtti.$ExtClass("TJSIDBObjectStore");
  this.$rtti.$ExtClass("TJSIDBRequest");
  this.$rtti.$ExtClass("TJSServiceWorker");
  this.$rtti.$ExtClass("TJSReadableStream");
  this.$rtti.$ExtClass("TJSClient");
  this.$rtti.$ExtClass("TJSFileSystemHandle");
  this.$rtti.$ExtClass("TJSFileSystemFileHandle");
  this.$rtti.$ExtClass("TJSFileSystemDirectoryHandle");
  this.$rtti.$ExtClass("TJSFileSystemWritableFileStream");
  this.$rtti.$ExtClass("TJSFileSystemSyncAccessHandle");
  this.$rtti.$ExtClass("TJSNotification");
  this.$rtti.$ExtClass("TJSNotificationEvent");
  this.$rtti.$ExtClass("TJSNotificationOptions");
  this.$rtti.$Class("TJSNotificationAction");
  this.$rtti.$Class("TJSGetNotificationOptions");
  this.$rtti.$Class("TJSNotificationEventInit");
  this.$rtti.$ProcVar("NotificationPermissionCallback",{procsig: rtl.newTIProcSig([["permission",rtl.string]])});
  this.$rtti.$DynArray("TJSFileSystemFileHandleArray",{eltype: this.$rtti["TJSFileSystemFileHandle"]});
  this.$rtti.$DynArray("TJSFileSystemDirectoryHandleArray",{eltype: this.$rtti["TJSFileSystemDirectoryHandle"]});
  this.$rtti.$ExtClass("TJSConsole",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Console"});
  this.$rtti.$RefToProcVar("TJSTimerCallBack",{procsig: rtl.newTIProcSig([],null,8)});
  rtl.recNewT(this,"TJSEventInit",function () {
    this.bubbles = false;
    this.cancelable = false;
    this.scoped = false;
    this.composed = false;
    this.$eq = function (b) {
      return (this.bubbles === b.bubbles) && (this.cancelable === b.cancelable) && (this.scoped === b.scoped) && (this.composed === b.composed);
    };
    this.$assign = function (s) {
      this.bubbles = s.bubbles;
      this.cancelable = s.cancelable;
      this.scoped = s.scoped;
      this.composed = s.composed;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSEventInit",{});
    $r.addField("bubbles",rtl.boolean);
    $r.addField("cancelable",rtl.boolean);
    $r.addField("scoped",rtl.boolean);
    $r.addField("composed",rtl.boolean);
  });
  this.$rtti.$ExtClass("TJSEvent",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Event"});
  this.$rtti.$ExtClass("TJSExtendableEvent",{ancestor: this.$rtti["TJSEvent"], jsclass: "ExtendableEvent"});
  this.$rtti.$RefToProcVar("TJSEventHandler",{procsig: rtl.newTIProcSig([["Event",this.$rtti["TJSEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSRawEventHandler",{procsig: rtl.newTIProcSig([["Event",this.$rtti["TJSEvent"]]],null,8)});
  this.$rtti.$ExtClass("TJSEventTarget",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "EventTarget"});
  this.$rtti.$ExtClass("TJSMessagePort",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "MessagePort"});
  this.$rtti.$DynArray("TJSMessagePortDynArray",{eltype: this.$rtti["TJSMessagePort"]});
  this.$rtti.$ExtClass("TJSMessageEvent",{ancestor: this.$rtti["TJSEvent"], jsclass: "MessageEvent"});
  this.$rtti.$ExtClass("TJSExtendableMessageEvent",{ancestor: this.$rtti["TJSExtendableEvent"], jsclass: "ExtendableMessageEvent"});
  this.$rtti.$ExtClass("TJSClient",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Client"});
  this.$rtti.$ExtClass("TJSStructuredSerializeOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSReadableStreamDefaultReader",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ReadableStreamDefaultReader"});
  this.$rtti.$ExtClass("TJSReadableStream",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ReadableStream"});
  this.$rtti.$ExtClass("TJSWritableStream",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "WritableStream"});
  this.$rtti.$ExtClass("TJSBlob",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "Blob"});
  this.$rtti.$ExtClass("TJSFileNewOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSFile",{ancestor: this.$rtti["TJSBlob"], jsclass: "File"});
  this.$rtti.$ExtClass("TJSBody",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Body"});
  this.$rtti.$StaticArray("Theader",{dims: [2], eltype: rtl.string});
  this.$rtti.$DynArray("THeaderArray",{eltype: this.$rtti["Theader"]});
  this.$rtti.$ExtClass("TJSHTMLHeaders",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Headers"});
  this.$rtti.$ExtClass("TJSResponseInit",{jsclass: "Object"});
  this.$rtti.$ExtClass("TJSResponse",{ancestor: this.$rtti["TJSBody"], jsclass: "Response"});
  this.$rtti.$ExtClass("TJSFormData",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "FormData"});
  this.$rtti.$ExtClass("TJSRequest",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Request"});
  this.$rtti.$DynArray("TJSRequestDynArray",{eltype: this.$rtti["TJSRequest"]});
  this.$rtti.$ExtClass("TJSFetchEvent",{ancestor: this.$rtti["TJSExtendableEvent"], jsclass: "FetchEvent"});
  rtl.createClass(this,"TJSIDBTransactionMode",pas.System.TObject,function () {
    this.readonly = "readonly";
    this.readwrite = "readwrite";
    this.versionchange = "versionchange";
  });
  this.$rtti.$ExtClass("TJSIDBTransaction",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBTransaction"});
  this.$rtti.$ExtClass("TJSIDBKeyRange",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBKeyRange"});
  rtl.recNewT(this,"TJSIDBIndexParameters",function () {
    this.unique = false;
    this.multiEntry = false;
    this.locale = "";
    this.$eq = function (b) {
      return (this.unique === b.unique) && (this.multiEntry === b.multiEntry) && (this.locale === b.locale);
    };
    this.$assign = function (s) {
      this.unique = s.unique;
      this.multiEntry = s.multiEntry;
      this.locale = s.locale;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSIDBIndexParameters",{});
    $r.addField("unique",rtl.boolean);
    $r.addField("multiEntry",rtl.boolean);
    $r.addField("locale",rtl.string);
  });
  this.$rtti.$ExtClass("TJSIDBIndex",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBIndex"});
  this.$rtti.$ExtClass("TJSIDBCursorDirection",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBCursorDirection"});
  this.$rtti.$ExtClass("TJSIDBCursor",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBCursor"});
  this.$rtti.$ExtClass("TJSIDBObjectStore",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBObjectStore"});
  this.$rtti.$ExtClass("TJSIDBRequest",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBRequest"});
  this.$rtti.$ExtClass("TJSIDBOpenDBRequest",{ancestor: this.$rtti["TJSIDBRequest"], jsclass: "IDBOpenDBRequest"});
  rtl.recNewT(this,"TJSCreateObjectStoreOptions",function () {
    this.keyPath = undefined;
    this.autoIncrement = false;
    this.$eq = function (b) {
      return (this.keyPath === b.keyPath) && (this.autoIncrement === b.autoIncrement);
    };
    this.$assign = function (s) {
      this.keyPath = s.keyPath;
      this.autoIncrement = s.autoIncrement;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCreateObjectStoreOptions",{});
    $r.addField("keyPath",rtl.jsvalue);
    $r.addField("autoIncrement",rtl.boolean);
  });
  this.$rtti.$ExtClass("TIDBDatabase",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBDatabase"});
  this.$rtti.$ExtClass("TJSIDBFactory",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBFactory"});
  this.$rtti.$ExtClass("TJSCacheDeleteOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$RefToProcVar("TJSParamEnumCallBack",{procsig: rtl.newTIProcSig([["aKey",rtl.string,2],["aValue",rtl.string,2]])});
  this.$rtti.$ExtClass("TJSURLSearchParams",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "URLSearchParams"});
  this.$rtti.$ExtClass("TJSURL",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "URL"});
  this.$rtti.$DynArray("TJSURLDynArray",{eltype: this.$rtti["TJSURL"]});
  this.$rtti.$ExtClass("TJSNavigationPreloadState",{jsclass: "navigationPreloadState"});
  this.$rtti.$ExtClass("TJSCache",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Cache"});
  this.$rtti.$ExtClass("TJSCacheStorage",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CacheStorage"});
  rtl.recNewT(this,"TJSCryptoAlgorithm",function () {
    this.name = "";
    this.$eq = function (b) {
      return this.name === b.name;
    };
    this.$assign = function (s) {
      this.name = s.name;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAlgorithm",{});
    $r.addField("name",rtl.string);
  });
  rtl.recNewT(this,"TJSCryptoAesCbcParams",function () {
    this.iv = null;
    this.$eq = function (b) {
      return this.iv === b.iv;
    };
    this.$assign = function (s) {
      this.iv = s.iv;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesCbcParams",{});
    $r.addField("iv",pas.JS.$rtti["TJSBufferSource"]);
  });
  rtl.recNewT(this,"TJSCryptoAesCtrParams",function () {
    this.counter = null;
    this.$eq = function (b) {
      return (this.counter === b.counter) && (this.length === b.length);
    };
    this.$assign = function (s) {
      this.counter = s.counter;
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesCtrParams",{});
    $r.addField("counter",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("length",rtl.byte);
  });
  rtl.recNewT(this,"TJSCryptoAesGcmParams",function () {
    this.iv = null;
    this.additionalData = null;
    this.tagLength = 0;
    this.$eq = function (b) {
      return (this.iv === b.iv) && (this.additionalData === b.additionalData) && (this.tagLength === b.tagLength);
    };
    this.$assign = function (s) {
      this.iv = s.iv;
      this.additionalData = s.additionalData;
      this.tagLength = s.tagLength;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesGcmParams",{});
    $r.addField("iv",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("additionalData",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("tagLength",rtl.byte);
  });
  rtl.recNewT(this,"TJSCryptoHmacImportParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return this.hash === b.hash;
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHmacImportParams",{});
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoPbkdf2Params",function () {
    this.salt = null;
    this.iterations = 0;
    this.hash = undefined;
    this.$eq = function (b) {
      return (this.salt === b.salt) && (this.iterations === b.iterations) && (this.hash === b.hash);
    };
    this.$assign = function (s) {
      this.salt = s.salt;
      this.iterations = s.iterations;
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoPbkdf2Params",{});
    $r.addField("salt",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("iterations",rtl.nativeint);
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoRsaHashedImportParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return this.hash === b.hash;
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaHashedImportParams",{});
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoAesKeyGenParams",function () {
    this.$eq = function (b) {
      return this.length === b.length;
    };
    this.$assign = function (s) {
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesKeyGenParams",{});
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoHmacKeyGenParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return (this.hash === b.hash) && (this.length === b.length);
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHmacKeyGenParams",{});
    $r.addField("hash",rtl.jsvalue);
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoRsaHashedKeyGenParams",function () {
    this.modulusLength = 0;
    this.publicExponent = null;
    this.hash = undefined;
    this.$eq = function (b) {
      return (this.modulusLength === b.modulusLength) && (this.publicExponent === b.publicExponent) && (this.hash === b.hash);
    };
    this.$assign = function (s) {
      this.modulusLength = s.modulusLength;
      this.publicExponent = s.publicExponent;
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaHashedKeyGenParams",{});
    $r.addField("modulusLength",rtl.longint);
    $r.addField("publicExponent",pas.JS.$rtti["TJSUint8Array"]);
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoRsaOaepParams",function () {
    this.$eq = function (b) {
      return this.label === b.label;
    };
    this.$assign = function (s) {
      this.label = s.label;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaOaepParams",{});
    $r.addField("label",pas.JS.$rtti["TJSBufferSource"]);
  });
  rtl.recNewT(this,"TJSCryptoRsaPssParams",function () {
    this.saltLength = 0;
    this.$eq = function (b) {
      return this.saltLength === b.saltLength;
    };
    this.$assign = function (s) {
      this.saltLength = s.saltLength;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaPssParams",{});
    $r.addField("saltLength",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoDhKeyGenParams",function () {
    this.prime = null;
    this.generator = null;
    this.$eq = function (b) {
      return (this.prime === b.prime) && (this.generator === b.generator);
    };
    this.$assign = function (s) {
      this.prime = s.prime;
      this.generator = s.generator;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoDhKeyGenParams",{});
    $r.addField("prime",pas.JS.$rtti["TJSUint8Array"]);
    $r.addField("generator",pas.JS.$rtti["TJSUint8Array"]);
  });
  rtl.recNewT(this,"TJSCryptoEcKeyGenParams",function () {
    this.$eq = function (b) {
      return this.namedCurve === b.namedCurve;
    };
    this.$assign = function (s) {
      this.namedCurve = s.namedCurve;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcKeyGenParams",{});
    $r.addField("namedCurve",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoAesDerivedKeyParams",function () {
    this.$eq = function (b) {
      return this.length === b.length;
    };
    this.$assign = function (s) {
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesDerivedKeyParams",{});
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoHmacDerivedKeyParams",function () {
    this.$eq = function (b) {
      return this.length === b.length;
    };
    this.$assign = function (s) {
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHmacDerivedKeyParams",{});
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoEcdhKeyDeriveParams",function () {
    this.$eq = function (b) {
      return this.public === b.public;
    };
    this.$assign = function (s) {
      this.public = s.public;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcdhKeyDeriveParams",{});
    $r.addField("public",$mod.$rtti["TJSCryptoKey"]);
  });
  rtl.recNewT(this,"TJSCryptoDhKeyDeriveParams",function () {
    this.$eq = function (b) {
      return this.public === b.public;
    };
    this.$assign = function (s) {
      this.public = s.public;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoDhKeyDeriveParams",{});
    $r.addField("public",$mod.$rtti["TJSCryptoKey"]);
  });
  rtl.recNewT(this,"TJSCryptoDhImportKeyParams",function () {
    this.prime = null;
    this.generator = null;
    this.$eq = function (b) {
      return (this.prime === b.prime) && (this.generator === b.generator);
    };
    this.$assign = function (s) {
      this.prime = s.prime;
      this.generator = s.generator;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoDhImportKeyParams",{});
    $r.addField("prime",pas.JS.$rtti["TJSUint8Array"]);
    $r.addField("generator",pas.JS.$rtti["TJSUint8Array"]);
  });
  rtl.recNewT(this,"TJSCryptoEcdsaParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return this.hash === b.hash;
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcdsaParams",{});
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoEcKeyImportParams",function () {
    this.$eq = function (b) {
      return this.namedCurve === b.namedCurve;
    };
    this.$assign = function (s) {
      this.namedCurve = s.namedCurve;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcKeyImportParams",{});
    $r.addField("namedCurve",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoHkdfParams",function () {
    this.hash = undefined;
    this.salt = null;
    this.info = null;
    this.$eq = function (b) {
      return (this.hash === b.hash) && (this.salt === b.salt) && (this.info === b.info);
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      this.salt = s.salt;
      this.info = s.info;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHkdfParams",{});
    $r.addField("hash",rtl.jsvalue);
    $r.addField("salt",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("info",pas.JS.$rtti["TJSBufferSource"]);
  });
  rtl.recNewT(this,"TJSCryptoRsaOtherPrimesInfo",function () {
    this.r = "";
    this.d = "";
    this.t = "";
    this.$eq = function (b) {
      return (this.r === b.r) && (this.d === b.d) && (this.t === b.t);
    };
    this.$assign = function (s) {
      this.r = s.r;
      this.d = s.d;
      this.t = s.t;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaOtherPrimesInfo",{});
    $r.addField("r",rtl.string);
    $r.addField("d",rtl.string);
    $r.addField("t",rtl.string);
  });
  this.$rtti.$DynArray("TJSCryptoRsaOtherPrimesInfoDynArray",{eltype: this.$rtti["TJSCryptoRsaOtherPrimesInfo"]});
  rtl.recNewT(this,"TJSCryptoJsonWebKey",function () {
    this.kty = "";
    this.use = "";
    this.alg = "";
    this.ext = false;
    this.crv = "";
    this.x = "";
    this.y = "";
    this.d = "";
    this.n = "";
    this.e = "";
    this.p = "";
    this.q = "";
    this.dp = "";
    this.dq = "";
    this.qi = "";
    this.k = "";
    this.$new = function () {
      var r = Object.create(this);
      r.key_ops = [];
      r.oth = [];
      return r;
    };
    this.$eq = function (b) {
      return (this.kty === b.kty) && (this.use === b.use) && (this.key_ops === b.key_ops) && (this.alg === b.alg) && (this.ext === b.ext) && (this.crv === b.crv) && (this.x === b.x) && (this.y === b.y) && (this.d === b.d) && (this.n === b.n) && (this.e === b.e) && (this.p === b.p) && (this.q === b.q) && (this.dp === b.dp) && (this.dq === b.dq) && (this.qi === b.qi) && (this.oth === b.oth) && (this.k === b.k);
    };
    this.$assign = function (s) {
      this.kty = s.kty;
      this.use = s.use;
      this.key_ops = rtl.arrayRef(s.key_ops);
      this.alg = s.alg;
      this.ext = s.ext;
      this.crv = s.crv;
      this.x = s.x;
      this.y = s.y;
      this.d = s.d;
      this.n = s.n;
      this.e = s.e;
      this.p = s.p;
      this.q = s.q;
      this.dp = s.dp;
      this.dq = s.dq;
      this.qi = s.qi;
      this.oth = rtl.arrayRef(s.oth);
      this.k = s.k;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoJsonWebKey",{});
    $r.addField("kty",rtl.string);
    $r.addField("use",rtl.string);
    $r.addField("key_ops",pas.Types.$rtti["TStringDynArray"]);
    $r.addField("alg",rtl.string);
    $r.addField("ext",rtl.boolean);
    $r.addField("crv",rtl.string);
    $r.addField("x",rtl.string);
    $r.addField("y",rtl.string);
    $r.addField("d",rtl.string);
    $r.addField("n",rtl.string);
    $r.addField("e",rtl.string);
    $r.addField("p",rtl.string);
    $r.addField("q",rtl.string);
    $r.addField("dp",rtl.string);
    $r.addField("dq",rtl.string);
    $r.addField("qi",rtl.string);
    $r.addField("oth",$mod.$rtti["TJSCryptoRsaOtherPrimesInfoDynArray"]);
    $r.addField("k",rtl.string);
  });
  rtl.recNewT(this,"TJSCryptoKeyPair",function () {
    this.publicKey = null;
    this.privateKey = null;
    this.$eq = function (b) {
      return (this.publicKey === b.publicKey) && (this.privateKey === b.privateKey);
    };
    this.$assign = function (s) {
      this.publicKey = s.publicKey;
      this.privateKey = s.privateKey;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoKeyPair",{});
    $r.addField("publicKey",$mod.$rtti["TJSCryptoKey"]);
    $r.addField("privateKey",$mod.$rtti["TJSCryptoKey"]);
  });
  this.$rtti.$DynArray("TJSCryptoKeyUsageDynArray",{eltype: rtl.string});
  this.$rtti.$ExtClass("TJSCryptoKey",{jsclass: "CryptoKey"});
  this.$rtti.$ExtClass("TJSSubtleCrypto",{jsclass: "SubtleCrypto"});
  this.$rtti.$ExtClass("TJSCrypto",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Crypto"});
  this.$rtti.$ExtClass("TJSEventSourceOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSEventSource",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "EventSource"});
  this.$rtti.$ExtClass("TJSNavigationPreload",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "navigationPreload"});
  this.$rtti.$ExtClass("TJSWorker",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "Worker"});
  this.$rtti.$ExtClass("TJSServiceWorkerRegistration",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ServiceWorkerRegistration"});
  this.$rtti.$ExtClass("TJSServiceWorker",{ancestor: this.$rtti["TJSWorker"], jsclass: "ServiceWorker"});
  this.$rtti.$RefToProcVar("TOnChangeProcedure",{procsig: rtl.newTIProcSig([])});
  this.$rtti.$ExtClass("TJSPermissionDescriptor",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSPermissionStatus",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "PermissionStatus"});
  this.$rtti.$ExtClass("TJSPermissions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Permissions"});
  this.$rtti.$ExtClass("TJSFileSystemHandlePermissionDescriptor",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  rtl.recNewT(this,"TJSFileSystemCreateWritableOptions",function () {
    this.keepExistingData = false;
    this.$eq = function (b) {
      return this.keepExistingData === b.keepExistingData;
    };
    this.$assign = function (s) {
      this.keepExistingData = s.keepExistingData;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemCreateWritableOptions",{});
    $r.addField("keepExistingData",rtl.boolean);
  });
  rtl.recNewT(this,"TJSFileSystemGetFileOptions",function () {
    this.create = false;
    this.$eq = function (b) {
      return this.create === b.create;
    };
    this.$assign = function (s) {
      this.create = s.create;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemGetFileOptions",{});
    $r.addField("create",rtl.boolean);
  });
  rtl.recNewT(this,"TJSFileSystemGetDirectoryOptions",function () {
    this.create = false;
    this.$eq = function (b) {
      return this.create === b.create;
    };
    this.$assign = function (s) {
      this.create = s.create;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemGetDirectoryOptions",{});
    $r.addField("create",rtl.boolean);
  });
  rtl.recNewT(this,"TJSFileSystemRemoveOptions",function () {
    this.recursive = false;
    this.$eq = function (b) {
      return this.recursive === b.recursive;
    };
    this.$assign = function (s) {
      this.recursive = s.recursive;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemRemoveOptions",{});
    $r.addField("recursive",rtl.boolean);
  });
  rtl.recNewT(this,"TJSWriteParams",function () {
    this.size = 0;
    this.position = 0;
    this.data = undefined;
    this.$eq = function (b) {
      return (this.type === b.type) && (this.size === b.size) && (this.position === b.position) && (this.data === b.data);
    };
    this.$assign = function (s) {
      this.type = s.type;
      this.size = s.size;
      this.position = s.position;
      this.data = s.data;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSWriteParams",{});
    $r.addField("type",rtl.string);
    $r.addField("size",rtl.nativeint);
    $r.addField("position",rtl.nativeint);
    $r.addField("data",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSFileSystemReadWriteOptions",function () {
    this.at = 0;
    this.$eq = function (b) {
      return this.at === b.at;
    };
    this.$assign = function (s) {
      this.at = s.at;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemReadWriteOptions",{});
    $r.addField("at",rtl.nativeint);
  });
  this.$rtti.$ExtClass("TJSFileSystemHandle",{jsclass: "FileSystemHandle"});
  this.$rtti.$ExtClass("TJSFileSystemSyncAccessHandle",{jsclass: "FileSystemSyncAccessHandle"});
  this.$rtti.$ExtClass("TJSFileSystemFileHandle",{ancestor: this.$rtti["TJSFileSystemHandle"], jsclass: "FileSystemFileHandle"});
  this.$rtti.$ExtClass("TJSFileSystemDirectoryHandle",{ancestor: this.$rtti["TJSFileSystemHandle"], jsclass: "FileSystemDirectoryHandle"});
  this.$rtti.$ExtClass("TJSFileSystemWritableFileStream",{ancestor: this.$rtti["TJSWritableStream"], jsclass: "FileSystemWritableFileStream"});
  this.$rtti.$ExtClass("TJSStorageManager",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "StorageManager"});
  this.$rtti.$RefToProcVar("TJSMicrotaskProcedure",{procsig: rtl.newTIProcSig([])});
  this.$rtti.$ExtClass("TJSImageBitmapOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TWindowOrWorkerGlobalScope",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSAbortSignal",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "AbortSignal"});
  this.$rtti.$ExtClass("TJSAbortController",{ancestor: this.$rtti["TJSAbortSignal"], jsclass: "AbortController"});
  this.$rtti.$DynArray("TTJSNotificationActionDynArray",{eltype: this.$rtti["TJSNotificationAction"]});
  this.$rtti.$ExtClass("TJSNotificationOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  rtl.createClassExt(this,"TJSNotificationAction",Object,"",function () {
    this.$init = function () {
      this.action = "";
      this.title = "";
      this.icon = "";
    };
    this.$final = function () {
    };
  });
  rtl.createClassExt(this,"TJSGetNotificationOptions",Object,"",function () {
    this.$init = function () {
      this.tag = "";
    };
    this.$final = function () {
    };
  });
  rtl.createClassExt(this,"TJSNotificationEventInit",Object,"",function () {
    this.$init = function () {
      this.notification = null;
      this.action = "";
    };
    this.$final = function () {
      this.notification = undefined;
    };
  });
  this.$rtti.$DynArray("TNativeIntDynArray",{eltype: rtl.nativeint});
  this.$rtti.$ExtClass("TJSNotification",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "Notification"});
  this.$rtti.$ExtClass("TJSNotificationEvent",{ancestor: this.$rtti["TJSExtendableEvent"], jsclass: "NotificationEvent"});
  this.$rtti.$ExtClass("TJSServiceWorkerGlobalScope",{jsclass: "ServiceWorkerGlobalScope"});
});
rtl.module("Web",["System","Types","JS","weborworker"],function () {
  "use strict";
  var $mod = this;
  this.$rtti.$ExtClass("TJSHTMLElement");
  this.$rtti.$ExtClass("TJSWindow");
  this.$rtti.$ExtClass("TJSDOMTokenList");
  this.$rtti.$ExtClass("TJSXPathResult");
  this.$rtti.$ExtClass("TJSNodeList");
  this.$rtti.$ExtClass("TJSDocument");
  this.$rtti.$ExtClass("TJSElement");
  this.$rtti.$ExtClass("TJSCSSStyleSheet");
  this.$rtti.$ExtClass("TJSNodeFilter");
  this.$rtti.$ExtClass("TJSMouseEvent");
  this.$rtti.$ExtClass("TJSWheelEvent");
  this.$rtti.$ExtClass("TJSKeyboardEvent");
  this.$rtti.$ExtClass("TJSPointerEvent");
  this.$rtti.$ExtClass("TJSUIEvent");
  this.$rtti.$ExtClass("TJSTouchEvent");
  this.$rtti.$ExtClass("TJSShowOpenFilePickerOptions");
  this.$rtti.$ExtClass("TJSShowSaveFilePickerOptions");
  this.$rtti.$RefToProcVar("TJSEventHandler",{procsig: rtl.newTIProcSig([["Event",pas.weborworker.$rtti["TJSEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSRawEventHandler",{procsig: rtl.newTIProcSig([["Event",pas.weborworker.$rtti["TJSEvent"]]],null,8)});
  this.$rtti.$ExtClass("TJSNode",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "Node"});
  this.$rtti.$RefToProcVar("TJSNodeListCallBack",{procsig: rtl.newTIProcSig([["currentValue",this.$rtti["TJSNode"]],["currentIndex",rtl.nativeint],["list",this.$rtti["TJSNodeList"]]])});
  this.$rtti.$ExtClass("TJSNodeList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "NodeList"});
  this.$rtti.$ExtClass("TJSAttr",{ancestor: this.$rtti["TJSNode"], jsclass: "Attr"});
  this.$rtti.$ExtClass("TJSNamedNodeMap",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "NamedNodeMap"});
  this.$rtti.$ExtClass("TJSHTMLCollection",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "HTMLCollection"});
  this.$rtti.$ProcVar("TDOMTokenlistCallBack",{procsig: rtl.newTIProcSig([["Current",rtl.jsvalue],["currentIndex",rtl.nativeint],["list",this.$rtti["TJSDOMTokenList"]]])});
  this.$rtti.$ExtClass("TJSDOMTokenList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DOMTokenList"});
  this.$rtti.$ExtClass("TJSDOMRect",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DOMRect"});
  rtl.recNewT(this,"TJSClientRect",function () {
    this.left = 0.0;
    this.top = 0.0;
    this.right = 0.0;
    this.bottom = 0.0;
    this.$eq = function (b) {
      return (this.left === b.left) && (this.top === b.top) && (this.right === b.right) && (this.bottom === b.bottom);
    };
    this.$assign = function (s) {
      this.left = s.left;
      this.top = s.top;
      this.right = s.right;
      this.bottom = s.bottom;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSClientRect",{});
    $r.addField("left",rtl.double);
    $r.addField("top",rtl.double);
    $r.addField("right",rtl.double);
    $r.addField("bottom",rtl.double);
  });
  this.$rtti.$ExtClass("TJSElement",{ancestor: this.$rtti["TJSNode"], jsclass: "Element"});
  rtl.recNewT(this,"TJSElementCreationOptions",function () {
    this.named = "";
    this.$eq = function (b) {
      return this.named === b.named;
    };
    this.$assign = function (s) {
      this.named = s.named;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSElementCreationOptions",{});
    $r.addField("named",rtl.string);
  });
  this.$rtti.$ExtClass("TJSDocumentType",{ancestor: this.$rtti["TJSNode"], jsclass: "DocumentType"});
  this.$rtti.$ExtClass("TJSDOMImplementation",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DocumentImplementation"});
  this.$rtti.$ExtClass("TJSLocation",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Location"});
  this.$rtti.$ExtClass("TJSCSSStyleDeclaration");
  this.$rtti.$ExtClass("TJSStyleSheet",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "StyleSheet"});
  this.$rtti.$ExtClass("TJSCSSRule",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CSSRule"});
  this.$rtti.$ExtClass("TJSCSSStyleRule",{ancestor: this.$rtti["TJSCSSRule"], jsclass: "CSSStyleRule"});
  this.$rtti.$ExtClass("TJSCSSRuleList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CSSRuleList"});
  this.$rtti.$ExtClass("TJSCSSStyleSheet",{ancestor: this.$rtti["TJSStyleSheet"], jsclass: "CSSStyleSheet"});
  this.$rtti.$ExtClass("TJSStyleSheetList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "StyleSheetList"});
  this.$rtti.$ExtClass("TJSDocumentFragment",{ancestor: this.$rtti["TJSNode"], jsclass: "DocumentFragment"});
  this.TJSShadowRootMode = {"0": "open", open: 0, "1": "closed", closed: 1};
  this.$rtti.$Enum("TJSShadowRootMode",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TJSShadowRootMode});
  this.TJSSlotAssignmentMode = {"0": "manual", manual: 0, "1": "named", named: 1};
  this.$rtti.$Enum("TJSSlotAssignmentMode",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TJSSlotAssignmentMode});
  this.$rtti.$ExtClass("TJSShadowRoot",{ancestor: this.$rtti["TJSDocumentFragment"], jsclass: "ShadowRoot"});
  rtl.createHelper(this,"TJSEventHelper",null,function () {
    this.GetCurrentTargetElement = function () {
      var Result = null;
      Result = this.currentTarget;
      return Result;
    };
    this.GetCurrentTargetHTMLElement = function () {
      var Result = null;
      Result = this.currentTarget;
      return Result;
    };
    this.GetTargetElement = function () {
      var Result = null;
      Result = this.target;
      return Result;
    };
    this.GetTargetHTMLElement = function () {
      var Result = null;
      Result = this.target;
      return Result;
    };
  });
  this.$rtti.$ExtClass("TJSXPathExpression",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "XPathExpression"});
  this.$rtti.$ExtClass("TJSXPathNSResolver",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "XPathNSResolver"});
  this.$rtti.$ExtClass("TJSCharacterData",{ancestor: this.$rtti["TJSNode"], jsclass: "CharacterData"});
  this.$rtti.$ExtClass("TJSProcessingInstruction",{ancestor: this.$rtti["TJSCharacterData"], jsclass: "ProcessingInstruction"});
  this.$rtti.$ExtClass("TJSRange",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Range"});
  this.$rtti.$ExtClass("TJSTreeWalker",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "TreeWalker"});
  this.$rtti.$ExtClass("TJSNodeFilter",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "NodeFilter"});
  this.$rtti.$ExtClass("TJSXPathResult",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "XPathResult"});
  this.$rtti.$ExtClass("TJSSelection",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Selection"});
  this.$rtti.$ProcVar("TJSNameSpaceMapperCallback",{procsig: rtl.newTIProcSig([["aNameSpace",rtl.string]],rtl.string)});
  this.$rtti.$ExtClass("TJSHTMLFile");
  this.$rtti.$ExtClass("TJSHTMLFileList");
  this.$rtti.$RefToProcVar("TJSDataTransferItemCallBack",{procsig: rtl.newTIProcSig([["aData",rtl.string]],null,8)});
  this.$rtti.$ExtClass("TJSDataTransferItem",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DataTransferItem"});
  this.$rtti.$ExtClass("TJSDataTransferItemList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DataTransferItemList"});
  this.$rtti.$ExtClass("TJSDataTransfer",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DataTransfer"});
  this.$rtti.$ExtClass("TJSDragEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "DragEvent"});
  this.$rtti.$RefToProcVar("TJSDragDropEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSDragEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("THTMLClickEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSMouseEvent"]]],rtl.boolean,8)});
  this.$rtti.$ExtClass("TJSClipBoardEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "ClipboardEvent"});
  rtl.createClassExt(this,"TJSFocusEvent",Event,"",function () {
    this.$init = function () {
    };
    this.$final = function () {
    };
  });
  rtl.createClassExt(this,"TJSAnimationEvent",Event,"",function () {
    this.$init = function () {
    };
    this.$final = function () {
    };
  });
  rtl.createClassExt(this,"TJSLoadEvent",Event,"",function () {
    this.$init = function () {
    };
    this.$final = function () {
    };
  });
  this.$rtti.$ExtClass("TJSErrorEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "ErrorEvent"});
  rtl.createClassExt(this,"TJSPageTransitionEvent",Event,"",function () {
    this.$init = function () {
    };
    this.$final = function () {
    };
  });
  this.$rtti.$ExtClass("TJSHashChangeEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "HashChangeEvent"});
  this.$rtti.$ExtClass("TJSPopStateEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "PopStateEvent"});
  this.$rtti.$ExtClass("TJSStorageEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "StorageEvent"});
  this.$rtti.$ExtClass("TJSProgressEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "ProgressEvent"});
  this.$rtti.$ExtClass("TJSCloseEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "CloseEvent"});
  this.$rtti.$RefToProcVar("TJSPageTransitionEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSPageTransitionEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSHashChangeEventhandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSHashChangeEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSMouseWheelEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSWheelEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSMouseEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSMouseEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("THTMLAnimationEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSAnimationEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSErrorEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSErrorEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSFocusEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSFocusEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSKeyEventhandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSKeyboardEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSLoadEventhandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSLoadEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSPointerEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSPointerEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSUIEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSUIEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSPopStateEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSPopStateEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSStorageEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSStorageEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSProgressEventhandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSProgressEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSTouchEventHandler",{procsig: rtl.newTIProcSig([["aEvent",this.$rtti["TJSTouchEvent"]]],rtl.boolean,8)});
  this.$rtti.$ExtClass("TJSDocument",{ancestor: this.$rtti["TJSNode"], jsclass: "Document"});
  this.$rtti.$ExtClass("TJSHistory",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "History"});
  this.$rtti.$ExtClass("TJSStorage",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "Storage"});
  this.$rtti.$ExtClass("TJSVisibleItem",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IVisible"});
  this.$rtti.$ExtClass("TJSLocationBar",{ancestor: this.$rtti["TJSVisibleItem"], jsclass: "LocationBar"});
  this.$rtti.$ExtClass("TJSMenuBar",{ancestor: this.$rtti["TJSVisibleItem"], jsclass: "MenuBar"});
  this.$rtti.$ExtClass("TJSToolBar",{ancestor: this.$rtti["TJSVisibleItem"], jsclass: "ToolBar"});
  this.$rtti.$ExtClass("TJSPersonalBar",{ancestor: this.$rtti["TJSVisibleItem"], jsclass: "PersonalBar"});
  this.$rtti.$ExtClass("TJSScrollBars",{ancestor: this.$rtti["TJSVisibleItem"], jsclass: "ScrollBars"});
  rtl.recNewT(this,"TJSPositionError",function () {
    this.code = 0;
    this.message = "";
    this.$eq = function (b) {
      return (this.code === b.code) && (this.message === b.message);
    };
    this.$assign = function (s) {
      this.code = s.code;
      this.message = s.message;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSPositionError",{});
    $r.addField("code",rtl.longint);
    $r.addField("message",rtl.string);
  });
  rtl.recNewT(this,"TJSPositionOptions",function () {
    this.enableHighAccuracy = false;
    this.timeout = 0;
    this.maximumAge = 0;
    this.$eq = function (b) {
      return (this.enableHighAccuracy === b.enableHighAccuracy) && (this.timeout === b.timeout) && (this.maximumAge === b.maximumAge);
    };
    this.$assign = function (s) {
      this.enableHighAccuracy = s.enableHighAccuracy;
      this.timeout = s.timeout;
      this.maximumAge = s.maximumAge;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSPositionOptions",{});
    $r.addField("enableHighAccuracy",rtl.boolean);
    $r.addField("timeout",rtl.longint);
    $r.addField("maximumAge",rtl.longint);
  });
  rtl.recNewT(this,"TJSCoordinates",function () {
    this.latitude = 0.0;
    this.longitude = 0.0;
    this.altitude = 0.0;
    this.accuracy = 0.0;
    this.altitudeAccuracy = 0.0;
    this.heading = 0.0;
    this.speed = 0.0;
    this.$eq = function (b) {
      return (this.latitude === b.latitude) && (this.longitude === b.longitude) && (this.altitude === b.altitude) && (this.accuracy === b.accuracy) && (this.altitudeAccuracy === b.altitudeAccuracy) && (this.heading === b.heading) && (this.speed === b.speed);
    };
    this.$assign = function (s) {
      this.latitude = s.latitude;
      this.longitude = s.longitude;
      this.altitude = s.altitude;
      this.accuracy = s.accuracy;
      this.altitudeAccuracy = s.altitudeAccuracy;
      this.heading = s.heading;
      this.speed = s.speed;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCoordinates",{});
    $r.addField("latitude",rtl.double);
    $r.addField("longitude",rtl.double);
    $r.addField("altitude",rtl.double);
    $r.addField("accuracy",rtl.double);
    $r.addField("altitudeAccuracy",rtl.double);
    $r.addField("heading",rtl.double);
    $r.addField("speed",rtl.double);
  });
  rtl.recNewT(this,"TJSPosition",function () {
    this.timestamp = "";
    this.$new = function () {
      var r = Object.create(this);
      r.coords = $mod.TJSCoordinates.$new();
      return r;
    };
    this.$eq = function (b) {
      return this.coords.$eq(b.coords) && (this.timestamp === b.timestamp);
    };
    this.$assign = function (s) {
      this.coords.$assign(s.coords);
      this.timestamp = s.timestamp;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSPosition",{});
    $r.addField("coords",$mod.$rtti["TJSCoordinates"]);
    $r.addField("timestamp",rtl.string);
  });
  this.$rtti.$ProcVar("TJSGeoLocationCallback",{procsig: rtl.newTIProcSig([["aPosition",this.$rtti["TJSPosition"]]])});
  this.$rtti.$MethodVar("TJSGeoLocationEvent",{procsig: rtl.newTIProcSig([["aPosition",this.$rtti["TJSPosition"]]]), methodkind: 0});
  this.$rtti.$ProcVar("TJSGeoLocationErrorCallback",{procsig: rtl.newTIProcSig([["aValue",this.$rtti["TJSPositionError"]]])});
  this.$rtti.$MethodVar("TJSGeoLocationErrorEvent",{procsig: rtl.newTIProcSig([["aValue",this.$rtti["TJSPositionError"]]]), methodkind: 0});
  this.$rtti.$ExtClass("TJSGeoLocation",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "GeoLocation"});
  this.$rtti.$ExtClass("TJSMediaStreamTrack",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "MediaStreamTrack"});
  this.$rtti.$ExtClass("TJSMediaConstraints",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSMediaDevices",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "MediaDevices"});
  this.$rtti.$ExtClass("TJSSharedWorker",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "SharedWorker"});
  rtl.recNewT(this,"TJSServiceWorkerContainerOptions",function () {
    this.scope = "";
    this.$eq = function (b) {
      return this.scope === b.scope;
    };
    this.$assign = function (s) {
      this.scope = s.scope;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSServiceWorkerContainerOptions",{});
    $r.addField("scope",rtl.string);
  });
  this.$rtti.$ExtClass("TJSServiceWorkerContainer",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ServiceWorkerContainer"});
  this.$rtti.$ExtClass("TJSClipboardItemOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSClipBoardItem",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ClipboardItem"});
  this.$rtti.$ExtClass("TJSClipBoard",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "Clipboard"});
  this.$rtti.$ExtClass("TJSNavigator",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Navigator"});
  this.$rtti.$ExtClass("TJSTouch",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Touch"});
  this.$rtti.$ExtClass("TJSTouchList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "TouchList"});
  this.$rtti.$ExtClass("TJSPerformance",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Performance"});
  this.$rtti.$ExtClass("TJSScreen",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Screen"});
  this.$rtti.$ExtClass("TJSMediaQueryList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "MediaQueryList"});
  this.$rtti.$RefToProcVar("TFrameRequestCallback",{procsig: rtl.newTIProcSig([["aTime",rtl.double]])});
  this.$rtti.$ExtClass("TJSPostMessageOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  rtl.createClass(this,"TJSIdleCallbackOptions",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.timeout = 0;
    };
  });
  this.$rtti.$ExtClass("TJSIdleDeadline",{jsclass: "IdleDeadline"});
  this.$rtti.$DynArray("TJSWindowArray",{eltype: this.$rtti["TJSWindow"]});
  this.$rtti.$RefToProcVar("TIdleCallbackProc",{procsig: rtl.newTIProcSig([["idleDeadline",this.$rtti["TJSIdleDeadline"]]])});
  this.$rtti.$ExtClass("TJSWindow",{ancestor: pas.weborworker.$rtti["TWindowOrWorkerGlobalScope"], jsclass: "Window"});
  this.$rtti.$ExtClass("TJSCSSStyleDeclaration",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CSSStyleDeclaration"});
  this.$rtti.$ExtClass("TJSScrollIntoViewOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSDatasetMap",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSHTMLElement",{ancestor: this.$rtti["TJSElement"], jsclass: "HTMLElement"});
  this.$rtti.$DynArray("TJSHTMLElementArray",{eltype: this.$rtti["TJSHTMLElement"]});
  this.$rtti.$ExtClass("TJSHTMLDivElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLDivElement"});
  this.$rtti.$ExtClass("TJSHTMLFormControlsCollection",{ancestor: this.$rtti["TJSHTMLCollection"], jsclass: "HTMLFormControlsCollection"});
  this.$rtti.$ExtClass("TJSHTMLFormElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLFormElement"});
  this.$rtti.$ExtClass("TJSValidityState",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ValidityState"});
  this.$rtti.$ExtClass("TJSHTMLFile",{ancestor: pas.weborworker.$rtti["TJSBlob"], jsclass: "File"});
  this.$rtti.$ExtClass("TJSHTMLFileList",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "FileList"});
  this.$rtti.$ExtClass("TJSHTMLInputElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLInputElement"});
  this.$rtti.$ExtClass("TJSDOMSettableTokenList",{ancestor: this.$rtti["TJSDOMTokenList"], jsclass: "DOMSettableTokenList"});
  this.$rtti.$ExtClass("TJSHTMLOutputElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLOutputElement"});
  this.$rtti.$ExtClass("TJSHTMLImageElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "Image"});
  this.$rtti.$ExtClass("TJSHTMLLinkElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLLinkElement"});
  this.$rtti.$ExtClass("TJSHTMLAnchorElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLAnchorElement"});
  this.$rtti.$ExtClass("TJSHTMLMenuElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLMenuElement"});
  this.$rtti.$ExtClass("TJSHTMLButtonElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLButtonElement"});
  this.$rtti.$ExtClass("TJSHTMLLabelElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLLabelElement"});
  this.$rtti.$ExtClass("TJSHTMLTextAreaElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLTextAreaElement"});
  this.$rtti.$ExtClass("TJSHTMLEmbedElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLEmbedElement"});
  this.$rtti.$ExtClass("TJSHTMLOptionElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "Option"});
  this.$rtti.$ExtClass("TJSHTMLOptGroupElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLOptGroupElement"});
  this.$rtti.$ExtClass("TJSHTMLOptionsCollection",{ancestor: this.$rtti["TJSHTMLCollection"], jsclass: "HTMLOptionsCollection"});
  this.$rtti.$ExtClass("TJSHTMLSelectElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLSelectElement"});
  this.$rtti.$ExtClass("TJSHTMLTableSectionElement");
  this.$rtti.$ExtClass("TJSHTMLTableRowElement");
  this.$rtti.$ExtClass("TJSHTMLTableElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLTableElement"});
  this.$rtti.$ExtClass("TJSHTMLTableSectionElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLTableSectionElement"});
  this.$rtti.$ExtClass("TJSHTMLTableCellElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLTableCellElement"});
  this.$rtti.$ExtClass("TJSHTMLTableRowElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLTableRowElement"});
  this.$rtti.$ExtClass("TJSHTMLTableDataCellElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLTableDataCellElement"});
  this.$rtti.$ExtClass("TJSCanvasRenderingContext2D");
  this.$rtti.$RefToProcVar("THTMLCanvasToBlobCallback",{procsig: rtl.newTIProcSig([["aBlob",pas.weborworker.$rtti["TJSBlob"]]],rtl.boolean,8)});
  this.$rtti.$ExtClass("TJSHTMLCanvasElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLCanvasElement"});
  this.$rtti.$ExtClass("TJSHTMLProgressElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLProgressElement"});
  this.$rtti.$ExtClass("TJSDOMException",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DOMException"});
  this.$rtti.$ExtClass("TJSFileReader",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "FileReader"});
  this.$rtti.$ExtClass("TJSCanvasGradient",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CanvasGradient"});
  this.$rtti.$ExtClass("TJSCanvasPattern",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CanvasPattern"});
  this.$rtti.$ExtClass("TJSPath2D",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Path2D"});
  this.$rtti.$ExtClass("TJSImageData",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ImageData"});
  this.$rtti.$ExtClass("TJSTextMetrics",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "TextMetrics"});
  this.$rtti.$ExtClass("TJSCanvasRenderingContext2D",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CanvasRenderingContext2D"});
  this.$rtti.$ExtClass("TJSImageBitmap",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ImageBitmap"});
  this.$rtti.$ExtClass("TJSOffscreenCanvasRenderingContext2D",{ancestor: this.$rtti["TJSCanvasRenderingContext2D"], jsclass: "CanvasRenderingContext2D"});
  this.$rtti.$ExtClass("TJSHTMLOffscreenCanvasElement",{ancestor: this.$rtti["TJSHTMLCanvasElement"], jsclass: "OffscreenCanvas"});
  this.$rtti.$ExtClass("TJSHTMLIFrameElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLIFrameElement"});
  this.$rtti.$ExtClass("TJSHTMLScriptElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLScriptElement"});
  this.$rtti.$ExtClass("TJSXMLHttpRequestEventTarget",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "XMLHttpRequestEventTarget"});
  this.$rtti.$ExtClass("TJSXMLHttpRequestUpload",{ancestor: this.$rtti["TJSXMLHttpRequestEventTarget"], jsclass: "XMLHttpRequestUpload"});
  this.$rtti.$RefToProcVar("TJSOnReadyStateChangeHandler",{procsig: rtl.newTIProcSig([],null,8)});
  this.$rtti.$ExtClass("TJSXMLHttpRequest",{ancestor: this.$rtti["TJSXMLHttpRequestEventTarget"], jsclass: "XMLHttpRequest"});
  this.$rtti.$ExtClass("TJSUIEvent",{ancestor: pas.weborworker.$rtti["TJSEvent"], jsclass: "UIEvent"});
  this.$rtti.$ExtClass("TJSMouseEvent",{ancestor: this.$rtti["TJSUIEvent"], jsclass: "MouseEvent"});
  rtl.recNewT(this,"TJSWheelEventInit",function () {
    this.deltaX = 0.0;
    this.deltaY = 0.0;
    this.deltaZ = 0.0;
    this.deltaMode = 0;
    this.$eq = function (b) {
      return (this.deltaX === b.deltaX) && (this.deltaY === b.deltaY) && (this.deltaZ === b.deltaZ) && (this.deltaMode === b.deltaMode);
    };
    this.$assign = function (s) {
      this.deltaX = s.deltaX;
      this.deltaY = s.deltaY;
      this.deltaZ = s.deltaZ;
      this.deltaMode = s.deltaMode;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSWheelEventInit",{});
    $r.addField("deltaX",rtl.double);
    $r.addField("deltaY",rtl.double);
    $r.addField("deltaZ",rtl.double);
    $r.addField("deltaMode",rtl.nativeint);
  });
  this.$rtti.$ExtClass("TJSWheelEvent",{ancestor: this.$rtti["TJSMouseEvent"], jsclass: "WheelEvent"});
  this.$rtti.$ExtClass("TJSPointerEvent",{ancestor: this.$rtti["TJSMouseEvent"], jsclass: "PointerEvent"});
  this.$rtti.$ExtClass("TJSTouchEvent",{ancestor: this.$rtti["TJSUIEvent"], jsclass: "TouchEvent"});
  rtl.createClass(this,"TJSKeyNames",pas.System.TObject,function () {
    this.Alt = "Alt";
    this.AltGraph = "AltGraph";
    this.CapsLock = "CapsLock";
    this.Control = "Control";
    this.Fn = "Fn";
    this.FnLock = "FnLock";
    this.Hyper = "Hyper";
    this.Meta = "Meta";
    this.NumLock = "NumLock";
    this.ScrollLock = "ScrollLock";
    this.Shift = "Shift";
    this.Super = "Super";
    this.Symbol = "Symbol";
    this.SymbolLock = "SymbolLock";
    this.Enter = "Enter";
    this.Tab = "Tab";
    this.Space = "Space";
    this.ArrowDown = "ArrowDown";
    this.ArrowLeft = "ArrowLeft";
    this.ArrowRight = "ArrowRight";
    this.ArrowUp = "ArrowUp";
    this._End = "End";
    this.Home = "Home";
    this.PageDown = "PageDown";
    this.PageUp = "PageUp";
    this.BackSpace = "Backspace";
    this.Clear = "Clear";
    this.Copy = "Copy";
    this.CrSel = "CrSel";
    this.Cut = "Cut";
    this.Delete = "Delete";
    this.EraseEof = "EraseEof";
    this.ExSel = "ExSel";
    this.Insert = "Insert";
    this.Paste = "Paste";
    this.Redo = "Redo";
    this.Undo = "Undo";
    this.Accept = "Accept";
    this.Again = "Again";
    this.Attn = "Attn";
    this.Cancel = "Cancel";
    this.ContextMenu = "Contextmenu";
    this.Escape = "Escape";
    this.Execute = "Execute";
    this.Find = "Find";
    this.Finish = "Finish";
    this.Help = "Help";
    this.Pause = "Pause";
    this.Play = "Play";
    this.Props = "Props";
    this.Select = "Select";
    this.ZoomIn = "ZoomIn";
    this.ZoomOut = "ZoomOut";
    this.BrightnessDown = "BrightnessDown";
    this.BrightnessUp = "BrightnessUp";
    this.Eject = "Eject";
    this.LogOff = "LogOff";
    this.Power = "Power";
    this.PowerOff = "PowerOff";
    this.PrintScreen = "PrintScreen";
    this.Hibernate = "Hibernate";
    this.Standby = "Standby";
    this.WakeUp = "WakeUp";
    this.AllCandidates = "AllCandidates";
    this.Alphanumeric = "Alphanumeric";
    this.CodeInput = "CodeInput";
    this.Compose = "Compose";
    this.Convert = "Convert";
    this.Dead = "Dead";
    this.FinalMode = "FinalMode";
    this.GroupFirst = "GroupFirst";
    this.GroupLast = "GroupLast";
    this.GroupNext = "GroupNext";
    this.GroupPrevious = "GroupPrevious";
    this.ModelChange = "ModelChange";
    this.NextCandidate = "NextCandidate";
    this.NonConvert = "NonConvert";
    this.PreviousCandidate = "PreviousCandidate";
    this.Process = "Process";
    this.SingleCandidate = "SingleCandidate";
    this.HangulMode = "HangulMode";
    this.HanjaMode = "HanjaMode";
    this.JunjaMode = "JunjaMode";
    this.Eisu = "Eisu";
    this.Hankaku = "Hankaku";
    this.Hiranga = "Hiranga";
    this.HirangaKatakana = "HirangaKatakana";
    this.KanaMode = "KanaMode";
    this.Katakana = "Katakana";
    this.Romaji = "Romaji";
    this.Zenkaku = "Zenkaku";
    this.ZenkakuHanaku = "ZenkakuHanaku";
    this.F1 = "F1";
    this.F2 = "F2";
    this.F3 = "F3";
    this.F4 = "F4";
    this.F5 = "F5";
    this.F6 = "F6";
    this.F7 = "F7";
    this.F8 = "F8";
    this.F9 = "F9";
    this.F10 = "F10";
    this.F11 = "F11";
    this.F12 = "F12";
    this.F13 = "F13";
    this.F14 = "F14";
    this.F15 = "F15";
    this.F16 = "F16";
    this.F17 = "F17";
    this.F18 = "F18";
    this.F19 = "F19";
    this.F20 = "F20";
    this.Soft1 = "Soft1";
    this.Soft2 = "Soft2";
    this.Soft3 = "Soft3";
    this.Soft4 = "Soft4";
    this.Decimal = "Decimal";
    this.Key11 = "Key11";
    this.Key12 = "Key12";
    this.Multiply = "Multiply";
    this.Add = "Add";
    this.NumClear = "Clear";
    this.Divide = "Divide";
    this.Subtract = "Subtract";
    this.Separator = "Separator";
    this.AppSwitch = "AppSwitch";
    this.Call = "Call";
    this.Camera = "Camera";
    this.CameraFocus = "CameraFocus";
    this.EndCall = "EndCall";
    this.GoBack = "GoBack";
    this.GoHome = "GoHome";
    this.HeadsetHook = "HeadsetHook";
    this.LastNumberRedial = "LastNumberRedial";
    this.Notification = "Notification";
    this.MannerMode = "MannerMode";
    this.VoiceDial = "VoiceDial";
  });
  this.$rtti.$ExtClass("TJSKeyboardEvent",{ancestor: this.$rtti["TJSUIEvent"], jsclass: "KeyboardEvent"});
  this.$rtti.$ExtClass("TJSMutationObserver");
  rtl.recNewT(this,"TJSMutationRecord",function () {
    this.type_ = "";
    this.target = null;
    this.addedNodes = null;
    this.removedNodes = null;
    this.previousSibling = null;
    this.nextSibling = null;
    this.attributeName = "";
    this.attributeNamespace = "";
    this.oldValue = "";
    this.$eq = function (b) {
      return (this.type_ === b.type_) && (this.target === b.target) && (this.addedNodes === b.addedNodes) && (this.removedNodes === b.removedNodes) && (this.previousSibling === b.previousSibling) && (this.nextSibling === b.nextSibling) && (this.attributeName === b.attributeName) && (this.attributeNamespace === b.attributeNamespace) && (this.oldValue === b.oldValue);
    };
    this.$assign = function (s) {
      this.type_ = s.type_;
      this.target = s.target;
      this.addedNodes = s.addedNodes;
      this.removedNodes = s.removedNodes;
      this.previousSibling = s.previousSibling;
      this.nextSibling = s.nextSibling;
      this.attributeName = s.attributeName;
      this.attributeNamespace = s.attributeNamespace;
      this.oldValue = s.oldValue;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSMutationRecord",{});
    $r.addField("type_",rtl.string);
    $r.addField("target",$mod.$rtti["TJSNode"]);
    $r.addField("addedNodes",$mod.$rtti["TJSNodeList"]);
    $r.addField("removedNodes",$mod.$rtti["TJSNodeList"]);
    $r.addField("previousSibling",$mod.$rtti["TJSNode"]);
    $r.addField("nextSibling",$mod.$rtti["TJSNode"]);
    $r.addField("attributeName",rtl.string);
    $r.addField("attributeNamespace",rtl.string);
    $r.addField("oldValue",rtl.string);
  });
  this.$rtti.$DynArray("TJSMutationRecordArray",{eltype: this.$rtti["TJSMutationRecord"]});
  this.$rtti.$RefToProcVar("TJSMutationCallback",{procsig: rtl.newTIProcSig([["mutations",this.$rtti["TJSMutationRecordArray"]],["observer",this.$rtti["TJSMutationObserver"]]],null,8)});
  rtl.recNewT(this,"TJSMutationObserverInit",function () {
    this.attributes = false;
    this.attributeOldValue = false;
    this.characterData = false;
    this.characterDataOldValue = false;
    this.childList = false;
    this.subTree = false;
    this.attributeFilter = null;
    this.$eq = function (b) {
      return (this.attributes === b.attributes) && (this.attributeOldValue === b.attributeOldValue) && (this.characterData === b.characterData) && (this.characterDataOldValue === b.characterDataOldValue) && (this.childList === b.childList) && (this.subTree === b.subTree) && (this.attributeFilter === b.attributeFilter);
    };
    this.$assign = function (s) {
      this.attributes = s.attributes;
      this.attributeOldValue = s.attributeOldValue;
      this.characterData = s.characterData;
      this.characterDataOldValue = s.characterDataOldValue;
      this.childList = s.childList;
      this.subTree = s.subTree;
      this.attributeFilter = s.attributeFilter;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSMutationObserverInit",{});
    $r.addField("attributes",rtl.boolean);
    $r.addField("attributeOldValue",rtl.boolean);
    $r.addField("characterData",rtl.boolean);
    $r.addField("characterDataOldValue",rtl.boolean);
    $r.addField("childList",rtl.boolean);
    $r.addField("subTree",rtl.boolean);
    $r.addField("attributeFilter",pas.JS.$rtti["TJSArray"]);
  });
  this.$rtti.$ExtClass("TJSMutationObserver",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "MutationObserver"});
  this.$rtti.$ExtClass("TJSWebSocket",{ancestor: pas.weborworker.$rtti["TJSEventTarget"], jsclass: "WebSocket"});
  this.$rtti.$ExtClass("TJSHTMLAudioTrack",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "AudioTrack"});
  this.$rtti.$ExtClass("TJSHTMLAudioTrackList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "AudioTrackList"});
  this.$rtti.$ExtClass("TJSHTMLVideoTrack",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "VideoTrack"});
  this.$rtti.$ExtClass("TJSHTMLVideoTrackList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "VideoTrackList"});
  this.$rtti.$ExtClass("TJSHTMLTextTrack",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "TextTrack"});
  this.$rtti.$ExtClass("TJSHTMLTextTrackList",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "TextTrackList"});
  this.$rtti.$ExtClass("TJSMEdiaError",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "MediaError"});
  this.$rtti.$ExtClass("TJSHTMLMediaStream",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "MediaStream"});
  this.$rtti.$ExtClass("TJSHTMLMediaController",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "MediaController"});
  this.$rtti.$ExtClass("TJSHTMLMediaElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLMediaElement"});
  this.$rtti.$ExtClass("TJSHTMLAudioElement",{ancestor: this.$rtti["TJSHTMLMediaElement"], jsclass: "HTMLAudioElement"});
  this.$rtti.$ExtClass("TJSHTMLVideoElement",{ancestor: this.$rtti["TJSHTMLMediaElement"], jsclass: "HTMLVideoElement"});
  this.$rtti.$ExtClass("TJSHTMLStyleElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLStyleElement"});
  this.$rtti.$DynArray("TJSFormDataEntryValueArray",{eltype: rtl.string});
  this.$rtti.$ExtClass("TJSFormData",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "FormData"});
  this.$rtti.$ExtClass("TJSHTMLTemplateElement",{ancestor: this.$rtti["TJSHTMLElement"], jsclass: "HTMLTemplateElement"});
  this.$rtti.$ExtClass("TJSHTMLOrXMLDocument",{ancestor: this.$rtti["TJSDocument"], jsclass: "Document"});
  this.$rtti.$ExtClass("TJSHTMLDocument",{ancestor: this.$rtti["TJSHTMLOrXMLDocument"], jsclass: "HTMLDocument"});
  this.$rtti.$ExtClass("TJSXMLDocument",{ancestor: this.$rtti["TJSHTMLOrXMLDocument"], jsclass: "HTMLDocument"});
  this.$rtti.$ExtClass("TDOMParser",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "DOMParser"});
  this.$rtti.$ExtClass("TJSShowOpenFilePickerTypeOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSShowOpenFilePickerOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSShowSaveFilePickerOptionsAccept",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSShowSaveFilePickerOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSXSLTProcessor",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "XSLTProcessor"});
  this.$rtti.$ExtClass("TJSXMLSerializer",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "XMLSerializer"});
  this.HasServiceWorker = function () {
    var Result = false;
    if (window.navigator.serviceWorker) {
      return true}
     else return false;
    return Result;
  };
});
rtl.module("Hvac.Web.Components.UIComponent",["System","Web"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TUIComponent",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FJSHtmlElement = null;
    };
    this.$final = function () {
      this.FJSHtmlElement = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (AJSHtmlElement) {
      this.FJSHtmlElement = AJSHtmlElement;
      return this;
    };
  });
});
rtl.module("Hvac.Web.Components.ThemeSwitcher",["System","Web","Hvac.Web.Components.UIComponent"],function () {
  "use strict";
  var $mod = this;
  rtl.recNewT(this,"TUITheme",function () {
    this.Title = "";
    this.ClassName = "";
    this.$eq = function (b) {
      return (this.Title === b.Title) && (this.ClassName === b.ClassName);
    };
    this.$assign = function (s) {
      this.Title = s.Title;
      this.ClassName = s.ClassName;
      return this;
    };
    var $r = $mod.$rtti.$Record("TUITheme",{});
    $r.addField("Title",rtl.string);
    $r.addField("ClassName",rtl.string);
  });
  rtl.createClass(this,"TThemeSwitcher",pas["Hvac.Web.Components.UIComponent"].TUIComponent,function () {
    this.$init = function () {
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$init.call(this);
      this.FThemes = [];
      this.FItemTemplate = null;
    };
    this.$final = function () {
      this.FThemes = undefined;
      this.FItemTemplate = undefined;
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$final.call(this);
    };
    this.AddTheme = function (ATheme) {
      this.FThemes = rtl.arraySetLength(this.FThemes,$mod.TUITheme,rtl.length(this.FThemes) + 1);
      this.FThemes[rtl.length(this.FThemes) - 1].$assign(ATheme);
    };
    this.AddTheme$1 = function (ATitle, AClassName) {
      var theme = $mod.TUITheme.$new();
      theme.Title = ATitle;
      theme.ClassName = AClassName;
      this.AddTheme($mod.TUITheme.$clone(theme));
    };
    this.Create$2 = function (AJSHtmlElement, AItemTemplate) {
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.Create$1.call(this,AJSHtmlElement);
      this.FItemTemplate = AItemTemplate;
      return this;
    };
    var $r = this.$rtti;
    $mod.$rtti.$DynArray("TThemeSwitcher.FThemes$a",{eltype: $mod.$rtti["TUITheme"]});
  });
});
