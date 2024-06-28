rtl.module("System",[],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.LineEnding = "\n";
  this.sLineBreak = this.LineEnding;
  this.MaxLongint = 0x7fffffff;
  this.Maxint = 2147483647;
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
    this.AfterConstruction = function () {
    };
    this.BeforeDestruction = function () {
    };
  });
  this.vtInteger = 0;
  this.vtExtended = 3;
  this.vtWideChar = 9;
  this.vtCurrency = 12;
  this.vtUnicodeString = 18;
  this.vtNativeInt = 19;
  rtl.recNewT(this,"TVarRec",function () {
    this.VType = 0;
    this.VJSValue = undefined;
    this.$eq = function (b) {
      return (this.VType === b.VType) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue) && (this.VJSValue === b.VJSValue);
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
      return this;
    };
  });
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
  this.val = function (S, NI, Code) {
    NI.set($impl.valint(S,-9007199254740991,9007199254740991,Code));
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
  this.Assigned = function (V) {
    return (V!=undefined) && (V!=null) && (!rtl.isArray(V) || (V.length > 0));
  };
  $mod.$implcode = function () {
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
});
rtl.module("JS",["System","Types"],function () {
  "use strict";
  var $mod = this;
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
  this.isBoolean = function (v) {
    return typeof(v) == 'boolean';
  };
  this.isInteger = function (v) {
    return Math.floor(v)===v;
  };
  this.isNull = function (v) {
    return v === null;
  };
  this.TJSValueType = {"0": "jvtNull", jvtNull: 0, "1": "jvtBoolean", jvtBoolean: 1, "2": "jvtInteger", jvtInteger: 2, "3": "jvtFloat", jvtFloat: 3, "4": "jvtString", jvtString: 4, "5": "jvtObject", jvtObject: 5, "6": "jvtArray", jvtArray: 6};
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
rtl.module("RTLConsts",["System"],function () {
  "use strict";
  var $mod = this;
  $mod.$resourcestrings = {SArgumentMissing: {org: 'Missing argument in format "%s"'}, SInvalidFormat: {org: 'Invalid format specifier : "%s"'}, SInvalidArgIndex: {org: 'Invalid argument index in format: "%s"'}, SListCapacityError: {org: "List capacity (%s) exceeded."}, SListCountError: {org: "List count (%s) out of bounds."}, SListIndexError: {org: "List index (%s) out of bounds"}, SInvalidBoolean: {org: '"%s" is not a valid boolean.'}, SErrInvalidInteger: {org: 'Invalid integer value: "%s"'}};
});
rtl.module("SysUtils",["System","RTLConsts","JS"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.FreeAndNil = function (Obj) {
    var o = null;
    o = Obj.get();
    if (o === null) return;
    Obj.set(null);
    o.$destroy("Destroy");
  };
  rtl.recNewT(this,"TFormatSettings",function () {
    this.CurrencyDecimals = 0;
    this.CurrencyFormat = 0;
    this.CurrencyString = "";
    this.DateSeparator = "\x00";
    this.DecimalSeparator = "";
    this.LongDateFormat = "";
    this.LongTimeFormat = "";
    this.NegCurrFormat = 0;
    this.ShortDateFormat = "";
    this.ShortTimeFormat = "";
    this.ThousandSeparator = "";
    this.TimeAMString = "";
    this.TimePMString = "";
    this.TimeSeparator = "\x00";
    this.TwoDigitYearCenturyWindow = 0;
    this.InitLocaleHandler = null;
    this.$new = function () {
      var r = Object.create(this);
      r.DateTimeToStrFormat = rtl.arraySetLength(null,"",2);
      r.LongDayNames = rtl.arraySetLength(null,"",7);
      r.LongMonthNames = rtl.arraySetLength(null,"",12);
      r.ShortDayNames = rtl.arraySetLength(null,"",7);
      r.ShortMonthNames = rtl.arraySetLength(null,"",12);
      return r;
    };
    this.$eq = function (b) {
      return (this.CurrencyDecimals === b.CurrencyDecimals) && (this.CurrencyFormat === b.CurrencyFormat) && (this.CurrencyString === b.CurrencyString) && (this.DateSeparator === b.DateSeparator) && rtl.arrayEq(this.DateTimeToStrFormat,b.DateTimeToStrFormat) && (this.DecimalSeparator === b.DecimalSeparator) && (this.LongDateFormat === b.LongDateFormat) && rtl.arrayEq(this.LongDayNames,b.LongDayNames) && rtl.arrayEq(this.LongMonthNames,b.LongMonthNames) && (this.LongTimeFormat === b.LongTimeFormat) && (this.NegCurrFormat === b.NegCurrFormat) && (this.ShortDateFormat === b.ShortDateFormat) && rtl.arrayEq(this.ShortDayNames,b.ShortDayNames) && rtl.arrayEq(this.ShortMonthNames,b.ShortMonthNames) && (this.ShortTimeFormat === b.ShortTimeFormat) && (this.ThousandSeparator === b.ThousandSeparator) && (this.TimeAMString === b.TimeAMString) && (this.TimePMString === b.TimePMString) && (this.TimeSeparator === b.TimeSeparator) && (this.TwoDigitYearCenturyWindow === b.TwoDigitYearCenturyWindow);
    };
    this.$assign = function (s) {
      this.CurrencyDecimals = s.CurrencyDecimals;
      this.CurrencyFormat = s.CurrencyFormat;
      this.CurrencyString = s.CurrencyString;
      this.DateSeparator = s.DateSeparator;
      this.DateTimeToStrFormat = s.DateTimeToStrFormat.slice(0);
      this.DecimalSeparator = s.DecimalSeparator;
      this.LongDateFormat = s.LongDateFormat;
      this.LongDayNames = s.LongDayNames.slice(0);
      this.LongMonthNames = s.LongMonthNames.slice(0);
      this.LongTimeFormat = s.LongTimeFormat;
      this.NegCurrFormat = s.NegCurrFormat;
      this.ShortDateFormat = s.ShortDateFormat;
      this.ShortDayNames = s.ShortDayNames.slice(0);
      this.ShortMonthNames = s.ShortMonthNames.slice(0);
      this.ShortTimeFormat = s.ShortTimeFormat;
      this.ThousandSeparator = s.ThousandSeparator;
      this.TimeAMString = s.TimeAMString;
      this.TimePMString = s.TimePMString;
      this.TimeSeparator = s.TimeSeparator;
      this.TwoDigitYearCenturyWindow = s.TwoDigitYearCenturyWindow;
      return this;
    };
    this.GetJSLocale = function () {
      return Intl.DateTimeFormat().resolvedOptions().locale;
    };
    this.Create = function () {
      var Result = $mod.TFormatSettings.$new();
      Result.$assign($mod.TFormatSettings.Create$1($mod.TFormatSettings.GetJSLocale()));
      return Result;
    };
    this.Create$1 = function (ALocale) {
      var Result = $mod.TFormatSettings.$new();
      Result.LongDayNames = $impl.DefaultLongDayNames.slice(0);
      Result.ShortDayNames = $impl.DefaultShortDayNames.slice(0);
      Result.ShortMonthNames = $impl.DefaultShortMonthNames.slice(0);
      Result.LongMonthNames = $impl.DefaultLongMonthNames.slice(0);
      Result.DateTimeToStrFormat[0] = "c";
      Result.DateTimeToStrFormat[1] = "f";
      Result.DateSeparator = "-";
      Result.TimeSeparator = ":";
      Result.ShortDateFormat = "yyyy-mm-dd";
      Result.LongDateFormat = "ddd, yyyy-mm-dd";
      Result.ShortTimeFormat = "hh:nn";
      Result.LongTimeFormat = "hh:nn:ss";
      Result.DecimalSeparator = ".";
      Result.ThousandSeparator = ",";
      Result.TimeAMString = "AM";
      Result.TimePMString = "PM";
      Result.TwoDigitYearCenturyWindow = 50;
      Result.CurrencyFormat = 0;
      Result.NegCurrFormat = 0;
      Result.CurrencyDecimals = 2;
      Result.CurrencyString = "$";
      if ($mod.TFormatSettings.InitLocaleHandler != null) $mod.TFormatSettings.InitLocaleHandler($mod.UpperCase(ALocale),$mod.TFormatSettings.$clone(Result));
      return Result;
    };
  },true);
  rtl.createClass(this,"Exception",pas.System.TObject,function () {
    this.LogMessageOnCreate = false;
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.fMessage = "";
    };
    this.Create$1 = function (Msg) {
      this.fMessage = Msg;
      if (this.LogMessageOnCreate) pas.System.Writeln("Created exception ",this.$classname," with message: ",Msg);
      return this;
    };
    this.CreateFmt = function (Msg, Args) {
      this.Create$1($mod.Format(Msg,Args));
      return this;
    };
  });
  rtl.createClass(this,"EConvertError",this.Exception,function () {
  });
  this.Trim = function (S) {
    return S.replace(/^[\s\uFEFF\xA0\x00-\x1f]+/,'').replace(/[\s\uFEFF\xA0\x00-\x1f]+$/,'');
  };
  this.TrimLeft = function (S) {
    return S.replace(/^[\s\uFEFF\xA0\x00-\x1f]+/,'');
  };
  this.UpperCase = function (s) {
    return s.toUpperCase();
  };
  this.LowerCase = function (s) {
    return s.toLowerCase();
  };
  this.Format = function (Fmt, Args) {
    var Result = "";
    Result = $mod.Format$1(Fmt,Args,$mod.FormatSettings);
    return Result;
  };
  this.Format$1 = function (Fmt, Args, aSettings) {
    var Result = "";
    var ChPos = 0;
    var OldPos = 0;
    var ArgPos = 0;
    var DoArg = 0;
    var Len = 0;
    var Hs = "";
    var ToAdd = "";
    var Index = 0;
    var Width = 0;
    var Prec = 0;
    var Left = false;
    var Fchar = "\x00";
    var vq = 0;
    function ReadFormat() {
      var Result = "\x00";
      var Value = 0;
      function ReadInteger() {
        var Code = 0;
        var ArgN = 0;
        if (Value !== -1) return;
        OldPos = ChPos;
        while ((ChPos <= Len) && (Fmt.charAt(ChPos - 1) <= "9") && (Fmt.charAt(ChPos - 1) >= "0")) ChPos += 1;
        if (ChPos > Len) $impl.DoFormatError(1,Fmt);
        if (Fmt.charAt(ChPos - 1) === "*") {
          if (Index === 255) {
            ArgN = ArgPos}
           else {
            ArgN = Index;
            Index += 1;
          };
          if ((ChPos > OldPos) || (ArgN > (rtl.length(Args) - 1))) $impl.DoFormatError(1,Fmt);
          ArgPos = ArgN + 1;
          var $tmp = Args[ArgN].VType;
          if ($tmp === 0) {
            Value = Args[ArgN].VJSValue}
           else if ($tmp === 19) {
            Value = Args[ArgN].VJSValue}
           else {
            $impl.DoFormatError(1,Fmt);
          };
          ChPos += 1;
        } else {
          if (OldPos < ChPos) {
            pas.System.val(pas.System.Copy(Fmt,OldPos,ChPos - OldPos),{get: function () {
                return Value;
              }, set: function (v) {
                Value = v;
              }},{get: function () {
                return Code;
              }, set: function (v) {
                Code = v;
              }});
            if (Code > 0) $impl.DoFormatError(1,Fmt);
          } else Value = -1;
        };
      };
      function ReadIndex() {
        if (Fmt.charAt(ChPos - 1) !== ":") {
          ReadInteger()}
         else Value = 0;
        if (Fmt.charAt(ChPos - 1) === ":") {
          if (Value === -1) $impl.DoFormatError(2,Fmt);
          Index = Value;
          Value = -1;
          ChPos += 1;
        };
      };
      function ReadLeft() {
        if (Fmt.charAt(ChPos - 1) === "-") {
          Left = true;
          ChPos += 1;
        } else Left = false;
      };
      function ReadWidth() {
        ReadInteger();
        if (Value !== -1) {
          Width = Value;
          Value = -1;
        };
      };
      function ReadPrec() {
        if (Fmt.charAt(ChPos - 1) === ".") {
          ChPos += 1;
          ReadInteger();
          if (Value === -1) Value = 0;
          Prec = Value;
        };
      };
      Index = 255;
      Width = -1;
      Prec = -1;
      Value = -1;
      ChPos += 1;
      if (Fmt.charAt(ChPos - 1) === "%") {
        Result = "%";
        return Result;
      };
      ReadIndex();
      ReadLeft();
      ReadWidth();
      ReadPrec();
      Result = pas.System.upcase(Fmt.charAt(ChPos - 1));
      return Result;
    };
    function Checkarg(AT, err) {
      var Result = false;
      Result = false;
      if (Index === 255) {
        DoArg = ArgPos}
       else DoArg = Index;
      ArgPos = DoArg + 1;
      if ((DoArg > (rtl.length(Args) - 1)) || (Args[DoArg].VType !== AT)) {
        if (err) $impl.DoFormatError(3,Fmt);
        ArgPos -= 1;
        return Result;
      };
      Result = true;
      return Result;
    };
    Result = "";
    Len = Fmt.length;
    ChPos = 1;
    OldPos = 1;
    ArgPos = 0;
    while (ChPos <= Len) {
      while ((ChPos <= Len) && (Fmt.charAt(ChPos - 1) !== "%")) ChPos += 1;
      if (ChPos > OldPos) Result = Result + pas.System.Copy(Fmt,OldPos,ChPos - OldPos);
      if (ChPos < Len) {
        Fchar = ReadFormat();
        var $tmp = Fchar;
        if ($tmp === "D") {
          if (Checkarg(0,false)) {
            ToAdd = $mod.IntToStr(Args[DoArg].VJSValue)}
           else if (Checkarg(19,true)) ToAdd = $mod.IntToStr(Args[DoArg].VJSValue);
          Width = Math.abs(Width);
          Index = Prec - ToAdd.length;
          if (ToAdd.charAt(0) !== "-") {
            ToAdd = pas.System.StringOfChar("0",Index) + ToAdd}
           else pas.System.Insert(pas.System.StringOfChar("0",Index + 1),{get: function () {
              return ToAdd;
            }, set: function (v) {
              ToAdd = v;
            }},2);
        } else if ($tmp === "U") {
          if (Checkarg(0,false)) {
            ToAdd = $mod.IntToStr(Args[DoArg].VJSValue >>> 0)}
           else if (Checkarg(19,true)) ToAdd = $mod.IntToStr(Args[DoArg].VJSValue);
          Width = Math.abs(Width);
          Index = Prec - ToAdd.length;
          ToAdd = pas.System.StringOfChar("0",Index) + ToAdd;
        } else if ($tmp === "E") {
          if (Checkarg(12,false)) {
            ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue / 10000,$mod.TFloatFormat.ffExponent,3,Prec,aSettings)}
           else if (Checkarg(3,true)) ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue,$mod.TFloatFormat.ffExponent,3,Prec,aSettings);
        } else if ($tmp === "F") {
          if (Checkarg(12,false)) {
            ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue / 10000,$mod.TFloatFormat.ffFixed,9999,Prec,aSettings)}
           else if (Checkarg(3,true)) ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue,$mod.TFloatFormat.ffFixed,9999,Prec,aSettings);
        } else if ($tmp === "G") {
          if (Checkarg(12,false)) {
            ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue / 10000,$mod.TFloatFormat.ffGeneral,Prec,3,aSettings)}
           else if (Checkarg(3,true)) ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue,$mod.TFloatFormat.ffGeneral,Prec,3,aSettings);
        } else if ($tmp === "N") {
          if (Checkarg(12,false)) {
            ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue / 10000,$mod.TFloatFormat.ffNumber,9999,Prec,aSettings)}
           else if (Checkarg(3,true)) ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue,$mod.TFloatFormat.ffNumber,9999,Prec,aSettings);
        } else if ($tmp === "M") {
          if (Checkarg(12,false)) {
            ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue / 10000,$mod.TFloatFormat.ffCurrency,9999,Prec,aSettings)}
           else if (Checkarg(3,true)) ToAdd = $mod.FloatToStrF$1(Args[DoArg].VJSValue,$mod.TFloatFormat.ffCurrency,9999,Prec,aSettings);
        } else if ($tmp === "S") {
          if (Checkarg(18,false)) {
            Hs = Args[DoArg].VJSValue}
           else if (Checkarg(9,true)) Hs = Args[DoArg].VJSValue;
          Index = Hs.length;
          if ((Prec !== -1) && (Index > Prec)) Index = Prec;
          ToAdd = pas.System.Copy(Hs,1,Index);
        } else if ($tmp === "P") {
          if (Checkarg(0,false)) {
            ToAdd = $mod.IntToHex(Args[DoArg].VJSValue,8)}
           else if (Checkarg(0,true)) ToAdd = $mod.IntToHex(Args[DoArg].VJSValue,16);
        } else if ($tmp === "X") {
          if (Checkarg(0,false)) {
            vq = Args[DoArg].VJSValue;
            Index = 16;
          } else if (Checkarg(19,true)) {
            vq = Args[DoArg].VJSValue;
            Index = 31;
          };
          if (Prec > Index) {
            ToAdd = $mod.IntToHex(vq,Index)}
           else {
            Index = 1;
            while ((rtl.shl(1,Index * 4) <= vq) && (Index < 16)) Index += 1;
            if (Index > Prec) Prec = Index;
            ToAdd = $mod.IntToHex(vq,Prec);
          };
        } else if ($tmp === "%") ToAdd = "%";
        if (Width !== -1) if (ToAdd.length < Width) if (!Left) {
          ToAdd = pas.System.StringOfChar(" ",Width - ToAdd.length) + ToAdd}
         else ToAdd = ToAdd + pas.System.StringOfChar(" ",Width - ToAdd.length);
        Result = Result + ToAdd;
      };
      ChPos += 1;
      OldPos = ChPos;
    };
    return Result;
  };
  this.TStringReplaceFlag = {"0": "rfReplaceAll", rfReplaceAll: 0, "1": "rfIgnoreCase", rfIgnoreCase: 1};
  this.StringReplace = function (aOriginal, aSearch, aReplace, Flags) {
    var Result = "";
    var REFlags = "";
    var REString = "";
    REFlags = "";
    if ($mod.TStringReplaceFlag.rfReplaceAll in Flags) REFlags = "g";
    if ($mod.TStringReplaceFlag.rfIgnoreCase in Flags) REFlags = REFlags + "i";
    REString = aSearch.replace(new RegExp($impl.RESpecials,"g"),"\\$1");
    Result = aOriginal.replace(new RegExp(REString,REFlags),aReplace);
    return Result;
  };
  this.IntToStr = function (Value) {
    var Result = "";
    Result = "" + Value;
    return Result;
  };
  this.TryStrToInt$2 = function (S, res) {
    var Result = false;
    Result = $impl.IntTryStrToInt(S,res,$mod.FormatSettings.DecimalSeparator);
    return Result;
  };
  this.StrToIntDef = function (S, aDef) {
    var Result = 0;
    var R = 0;
    if ($mod.TryStrToInt$2(S,{get: function () {
        return R;
      }, set: function (v) {
        R = v;
      }})) {
      Result = R}
     else Result = aDef;
    return Result;
  };
  this.StrToInt = function (S) {
    var Result = 0;
    var R = 0;
    if (!$mod.TryStrToInt$2(S,{get: function () {
        return R;
      }, set: function (v) {
        R = v;
      }})) throw $mod.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidInteger"),pas.System.VarRecs(18,S)]);
    Result = R;
    return Result;
  };
  this.IntToHex = function (Value, Digits) {
    var Result = "";
    Result = "";
    if (Value < 0) if (Value<0) Value = 0xFFFFFFFF + Value + 1;
    Result=Value.toString(16);
    Result = $mod.UpperCase(Result);
    while (Result.length < Digits) Result = "0" + Result;
    return Result;
  };
  this.TFloatFormat = {"0": "ffFixed", ffFixed: 0, "1": "ffGeneral", ffGeneral: 1, "2": "ffExponent", ffExponent: 2, "3": "ffNumber", ffNumber: 3, "4": "ffCurrency", ffCurrency: 4};
  this.FloatToStrF$1 = function (Value, format, Precision, Digits, aSettings) {
    var Result = "";
    var TS = "";
    var DS = "";
    DS = aSettings.DecimalSeparator;
    TS = aSettings.ThousandSeparator;
    var $tmp = format;
    if ($tmp === $mod.TFloatFormat.ffGeneral) {
      Result = $impl.FormatGeneralFloat(Value,Precision,DS)}
     else if ($tmp === $mod.TFloatFormat.ffExponent) {
      Result = $impl.FormatExponentFloat(Value,Precision,Digits,DS)}
     else if ($tmp === $mod.TFloatFormat.ffFixed) {
      Result = $impl.FormatFixedFloat(Value,Digits,DS)}
     else if ($tmp === $mod.TFloatFormat.ffNumber) {
      Result = $impl.FormatNumberFloat(Value,Digits,DS,TS)}
     else if ($tmp === $mod.TFloatFormat.ffCurrency) Result = $impl.FormatNumberCurrency(Value * 10000,Digits,aSettings);
    if ((format !== $mod.TFloatFormat.ffCurrency) && (Result.length > 1) && (Result.charAt(0) === "-")) $impl.RemoveLeadingNegativeSign({get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }},DS,TS);
    return Result;
  };
  this.TryStrToFloat$2 = function (S, res) {
    var Result = false;
    Result = $mod.TryStrToFloat$3(S,res,$mod.FormatSettings);
    return Result;
  };
  var TDecimalPart = {"0": "dpDigit", dpDigit: 0, "1": "dpSignificand", dpSignificand: 1, "2": "dpExp", dpExp: 2};
  this.TryStrToFloat$3 = function (S, res, aSettings) {
    var Result = false;
    var J = undefined;
    var I = 0;
    var aStart = 0;
    var Len = 0;
    var N = "";
    var p = 0;
    Result = false;
    N = S;
    if (aSettings.ThousandSeparator !== "") N = $mod.StringReplace(N,aSettings.ThousandSeparator,"",rtl.createSet($mod.TStringReplaceFlag.rfReplaceAll));
    if (aSettings.DecimalSeparator !== ".") N = $mod.StringReplace(N,aSettings.DecimalSeparator,".",{});
    p = TDecimalPart.dpDigit;
    I = 1;
    aStart = 1;
    Len = N.length;
    while (I <= Len) {
      var $tmp = N.charAt(I - 1);
      if (($tmp === "+") || ($tmp === "-")) {
        var $tmp1 = p;
        if ($tmp1 === TDecimalPart.dpSignificand) {
          return Result}
         else if ($tmp1 === TDecimalPart.dpDigit) {
          if (I > aStart) return Result}
         else if ($tmp1 === TDecimalPart.dpExp) if (I > (aStart + 1)) return Result;
      } else if (($tmp >= "0") && ($tmp <= "9")) {}
      else if ($tmp === ".") {
        if (p !== TDecimalPart.dpDigit) return Result;
        p = TDecimalPart.dpSignificand;
        aStart = I;
      } else if (($tmp === "E") || ($tmp === "e")) {
        if (p === TDecimalPart.dpExp) {
          return Result}
         else {
          p = TDecimalPart.dpExp;
          aStart = I;
        };
      } else {
        return Result;
      };
      I += 1;
    };
    J = parseFloat(N);
    Result = !isNaN(J);
    if (Result) res.set(rtl.getNumber(J));
    return Result;
  };
  this.TrueBoolStrs = [];
  this.FalseBoolStrs = [];
  this.StrToBool = function (S) {
    var Result = false;
    if (!$mod.TryStrToBool(S,{get: function () {
        return Result;
      }, set: function (v) {
        Result = v;
      }})) throw $mod.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SInvalidBoolean"),pas.System.VarRecs(18,S)]);
    return Result;
  };
  this.BoolToStr = function (B, UseBoolStrs) {
    var Result = "";
    if (UseBoolStrs) {
      $impl.CheckBoolStrs();
      if (B) {
        Result = $mod.TrueBoolStrs[0]}
       else Result = $mod.FalseBoolStrs[0];
    } else if (B) {
      Result = "-1"}
     else Result = "0";
    return Result;
  };
  this.TryStrToBool = function (S, Value) {
    var Result = false;
    var Temp = "";
    var I = 0;
    var D = 0.0;
    var Code = 0;
    Temp = $mod.UpperCase(S);
    pas.System.val$8(Temp,{get: function () {
        return D;
      }, set: function (v) {
        D = v;
      }},{get: function () {
        return Code;
      }, set: function (v) {
        Code = v;
      }});
    Result = true;
    if (Code === 0) {
      Value.set(D !== 0.0)}
     else {
      $impl.CheckBoolStrs();
      for (var $l = 0, $end = rtl.length($mod.TrueBoolStrs) - 1; $l <= $end; $l++) {
        I = $l;
        if (Temp === $mod.UpperCase($mod.TrueBoolStrs[I])) {
          Value.set(true);
          return Result;
        };
      };
      for (var $l1 = 0, $end1 = rtl.length($mod.FalseBoolStrs) - 1; $l1 <= $end1; $l1++) {
        I = $l1;
        if (Temp === $mod.UpperCase($mod.FalseBoolStrs[I])) {
          Value.set(false);
          return Result;
        };
      };
      Result = false;
    };
    return Result;
  };
  this.TimeSeparator = "\x00";
  this.DateSeparator = "\x00";
  this.ShortDateFormat = "";
  this.LongDateFormat = "";
  this.ShortTimeFormat = "";
  this.LongTimeFormat = "";
  this.DecimalSeparator = "";
  this.ThousandSeparator = "";
  this.TimeAMString = "";
  this.TimePMString = "";
  this.ShortMonthNames = rtl.arraySetLength(null,"",12);
  this.LongMonthNames = rtl.arraySetLength(null,"",12);
  this.ShortDayNames = rtl.arraySetLength(null,"",7);
  this.LongDayNames = rtl.arraySetLength(null,"",7);
  this.FormatSettings = this.TFormatSettings.$new();
  this.CurrencyFormat = 0;
  this.NegCurrFormat = 0;
  this.CurrencyDecimals = 0;
  this.CurrencyString = "";
  rtl.createHelper(this,"TStringHelper",null,function () {
    this.Empty = "";
    this.IsNullOrWhiteSpace = function (AValue) {
      var Result = false;
      Result = $mod.Trim(AValue).length === 0;
      return Result;
    };
  });
  $mod.$implcode = function () {
    $impl.DefaultShortMonthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    $impl.DefaultLongMonthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    $impl.DefaultShortDayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    $impl.DefaultLongDayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    $impl.CheckBoolStrs = function () {
      if (rtl.length($mod.TrueBoolStrs) === 0) {
        $mod.TrueBoolStrs = rtl.arraySetLength($mod.TrueBoolStrs,"",1);
        $mod.TrueBoolStrs[0] = "True";
      };
      if (rtl.length($mod.FalseBoolStrs) === 0) {
        $mod.FalseBoolStrs = rtl.arraySetLength($mod.FalseBoolStrs,"",1);
        $mod.FalseBoolStrs[0] = "False";
      };
    };
    $impl.feInvalidFormat = 1;
    $impl.feMissingArgument = 2;
    $impl.feInvalidArgIndex = 3;
    $impl.DoFormatError = function (ErrCode, fmt) {
      var $tmp = ErrCode;
      if ($tmp === 1) {
        throw $mod.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SInvalidFormat"),pas.System.VarRecs(18,fmt)])}
       else if ($tmp === 2) {
        throw $mod.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SArgumentMissing"),pas.System.VarRecs(18,fmt)])}
       else if ($tmp === 3) throw $mod.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SInvalidArgIndex"),pas.System.VarRecs(18,fmt)]);
    };
    $impl.maxdigits = 15;
    $impl.ReplaceDecimalSep = function (S, DS) {
      var Result = "";
      var P = 0;
      P = pas.System.Pos(".",S);
      if (P > 0) {
        Result = pas.System.Copy(S,1,P - 1) + DS + pas.System.Copy(S,P + 1,S.length - P)}
       else Result = S;
      return Result;
    };
    $impl.FormatGeneralFloat = function (Value, Precision, DS) {
      var Result = "";
      var P = 0;
      var PE = 0;
      var Q = 0;
      var Exponent = 0;
      if ((Precision === -1) || (Precision > 15)) Precision = 15;
      Result = rtl.floatToStr(Value,Precision + 7);
      Result = $mod.TrimLeft(Result);
      P = pas.System.Pos(".",Result);
      if (P === 0) return Result;
      PE = pas.System.Pos("E",Result);
      if (PE === 0) {
        Result = $impl.ReplaceDecimalSep(Result,DS);
        return Result;
      };
      Q = PE + 2;
      Exponent = 0;
      while (Q <= Result.length) {
        Exponent = ((Exponent * 10) + Result.charCodeAt(Q - 1)) - 48;
        Q += 1;
      };
      if (Result.charAt((PE + 1) - 1) === "-") Exponent = -Exponent;
      if (((P + Exponent) < PE) && (Exponent > -6)) {
        Result = rtl.strSetLength(Result,PE - 1);
        if (Exponent >= 0) {
          for (var $l = 0, $end = Exponent - 1; $l <= $end; $l++) {
            Q = $l;
            Result = rtl.setCharAt(Result,P - 1,Result.charAt((P + 1) - 1));
            P += 1;
          };
          Result = rtl.setCharAt(Result,P - 1,".");
          P = 1;
          if (Result.charAt(P - 1) === "-") P += 1;
          while ((Result.charAt(P - 1) === "0") && (P < Result.length) && (pas.System.Copy(Result,P + 1,DS.length) !== DS)) pas.System.Delete({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},P,1);
        } else {
          pas.System.Insert(pas.System.Copy("00000",1,-Exponent),{get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},P - 1);
          Result = rtl.setCharAt(Result,P - Exponent - 1,Result.charAt(P - Exponent - 1 - 1));
          Result = rtl.setCharAt(Result,P - 1,".");
          if (Exponent !== -1) Result = rtl.setCharAt(Result,P - Exponent - 1 - 1,"0");
        };
        Q = Result.length;
        while ((Q > 0) && (Result.charAt(Q - 1) === "0")) Q -= 1;
        if (Result.charAt(Q - 1) === ".") Q -= 1;
        if ((Q === 0) || ((Q === 1) && (Result.charAt(0) === "-"))) {
          Result = "0"}
         else Result = rtl.strSetLength(Result,Q);
      } else {
        while (Result.charAt(PE - 1 - 1) === "0") {
          pas.System.Delete({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},PE - 1,1);
          PE -= 1;
        };
        if (Result.charAt(PE - 1 - 1) === DS) {
          pas.System.Delete({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},PE - 1,1);
          PE -= 1;
        };
        if (Result.charAt((PE + 1) - 1) === "+") {
          pas.System.Delete({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},PE + 1,1)}
         else PE += 1;
        while (Result.charAt((PE + 1) - 1) === "0") pas.System.Delete({get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }},PE + 1,1);
      };
      Result = $impl.ReplaceDecimalSep(Result,DS);
      return Result;
    };
    $impl.FormatExponentFloat = function (Value, Precision, Digits, DS) {
      var Result = "";
      var P = 0;
      DS = $mod.FormatSettings.DecimalSeparator;
      if ((Precision === -1) || (Precision > 15)) Precision = 15;
      Result = rtl.floatToStr(Value,Precision + 7);
      while (Result.charAt(0) === " ") pas.System.Delete({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},1,1);
      P = pas.System.Pos("E",Result);
      if (P === 0) {
        Result = $impl.ReplaceDecimalSep(Result,DS);
        return Result;
      };
      P += 2;
      if (Digits > 4) Digits = 4;
      Digits = (Result.length - P - Digits) + 1;
      if (Digits < 0) {
        pas.System.Insert(pas.System.Copy("0000",1,-Digits),{get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }},P)}
       else while ((Digits > 0) && (Result.charAt(P - 1) === "0")) {
        pas.System.Delete({get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }},P,1);
        if (P > Result.length) {
          pas.System.Delete({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},P - 2,2);
          break;
        };
        Digits -= 1;
      };
      Result = $impl.ReplaceDecimalSep(Result,DS);
      return Result;
    };
    $impl.FormatFixedFloat = function (Value, Digits, DS) {
      var Result = "";
      if (Digits === -1) {
        Digits = 2}
       else if (Digits > 18) Digits = 18;
      Result = rtl.floatToStr(Value,0,Digits);
      if ((Result !== "") && (Result.charAt(0) === " ")) pas.System.Delete({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},1,1);
      Result = $impl.ReplaceDecimalSep(Result,DS);
      return Result;
    };
    $impl.FormatNumberFloat = function (Value, Digits, DS, TS) {
      var Result = "";
      var P = 0;
      if (Digits === -1) {
        Digits = 2}
       else if (Digits > 15) Digits = 15;
      Result = rtl.floatToStr(Value,0,Digits);
      if ((Result !== "") && (Result.charAt(0) === " ")) pas.System.Delete({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},1,1);
      P = pas.System.Pos(".",Result);
      if (P <= 0) P = Result.length + 1;
      Result = $impl.ReplaceDecimalSep(Result,DS);
      P -= 3;
      if ((TS !== "") && (TS !== "\x00")) while (P > 1) {
        if (Result.charAt(P - 1 - 1) !== "-") pas.System.Insert(TS,{get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }},P);
        P -= 3;
      };
      return Result;
    };
    $impl.RemoveLeadingNegativeSign = function (AValue, DS, aThousandSeparator) {
      var Result = false;
      var i = 0;
      var TS = "";
      var StartPos = 0;
      Result = false;
      StartPos = 2;
      TS = aThousandSeparator;
      for (var $l = StartPos, $end = AValue.get().length; $l <= $end; $l++) {
        i = $l;
        Result = (AValue.get().charCodeAt(i - 1) in rtl.createSet(48,DS.charCodeAt(),69,43)) || (AValue.get().charAt(i - 1) === TS);
        if (!Result) break;
      };
      if (Result && (AValue.get().charAt(0) === "-")) pas.System.Delete(AValue,1,1);
      return Result;
    };
    $impl.FormatNumberCurrency = function (Value, Digits, aSettings) {
      var Result = "";
      var Negative = false;
      var P = 0;
      var CS = "";
      var DS = "";
      var TS = "";
      DS = aSettings.DecimalSeparator;
      TS = aSettings.ThousandSeparator;
      CS = aSettings.CurrencyString;
      if (Digits === -1) {
        Digits = aSettings.CurrencyDecimals}
       else if (Digits > 18) Digits = 18;
      Result = rtl.floatToStr(Value / 10000,0,Digits);
      Negative = Result.charAt(0) === "-";
      if (Negative) pas.System.Delete({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},1,1);
      P = pas.System.Pos(".",Result);
      if (TS !== "") {
        if (P !== 0) {
          Result = $impl.ReplaceDecimalSep(Result,DS)}
         else P = Result.length + 1;
        P -= 3;
        while (P > 1) {
          pas.System.Insert(TS,{get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},P);
          P -= 3;
        };
      };
      if (Negative) $impl.RemoveLeadingNegativeSign({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},DS,TS);
      if (!Negative) {
        var $tmp = aSettings.CurrencyFormat;
        if ($tmp === 0) {
          Result = CS + Result}
         else if ($tmp === 1) {
          Result = Result + CS}
         else if ($tmp === 2) {
          Result = CS + " " + Result}
         else if ($tmp === 3) Result = Result + " " + CS;
      } else {
        var $tmp1 = aSettings.NegCurrFormat;
        if ($tmp1 === 0) {
          Result = "(" + CS + Result + ")"}
         else if ($tmp1 === 1) {
          Result = "-" + CS + Result}
         else if ($tmp1 === 2) {
          Result = CS + "-" + Result}
         else if ($tmp1 === 3) {
          Result = CS + Result + "-"}
         else if ($tmp1 === 4) {
          Result = "(" + Result + CS + ")"}
         else if ($tmp1 === 5) {
          Result = "-" + Result + CS}
         else if ($tmp1 === 6) {
          Result = Result + "-" + CS}
         else if ($tmp1 === 7) {
          Result = Result + CS + "-"}
         else if ($tmp1 === 8) {
          Result = "-" + Result + " " + CS}
         else if ($tmp1 === 9) {
          Result = "-" + CS + " " + Result}
         else if ($tmp1 === 10) {
          Result = Result + " " + CS + "-"}
         else if ($tmp1 === 11) {
          Result = CS + " " + Result + "-"}
         else if ($tmp1 === 12) {
          Result = CS + " " + "-" + Result}
         else if ($tmp1 === 13) {
          Result = Result + "-" + " " + CS}
         else if ($tmp1 === 14) {
          Result = "(" + CS + " " + Result + ")"}
         else if ($tmp1 === 15) Result = "(" + Result + " " + CS + ")";
      };
      return Result;
    };
    $impl.RESpecials = "([\\$\\+\\[\\]\\(\\)\\\\\\.\\*\\^\\?\\|])";
    $impl.IntTryStrToInt = function (S, res, aSep) {
      var Result = false;
      var Radix = 10;
      var N = "";
      var J = undefined;
      N = S;
      if ((pas.System.Pos(aSep,N) !== 0) || (pas.System.Pos(".",N) !== 0)) return false;
      var $tmp = pas.System.Copy(N,1,1);
      if ($tmp === "$") {
        Radix = 16}
       else if ($tmp === "&") {
        Radix = 8}
       else if ($tmp === "%") Radix = 2;
      if ((Radix !== 16) && (pas.System.Pos("e",$mod.LowerCase(N)) !== 0)) return false;
      if (Radix !== 10) pas.System.Delete({get: function () {
          return N;
        }, set: function (v) {
          N = v;
        }},1,1);
      J = parseInt(N,Radix);
      Result = !isNaN(J);
      if (Result) res.set(rtl.trunc(J));
      return Result;
    };
    $impl.InitGlobalFormatSettings = function () {
      $mod.FormatSettings.$assign($mod.TFormatSettings.Create());
      $mod.TimeSeparator = $mod.FormatSettings.TimeSeparator;
      $mod.DateSeparator = $mod.FormatSettings.DateSeparator;
      $mod.ShortDateFormat = $mod.FormatSettings.ShortDateFormat;
      $mod.LongDateFormat = $mod.FormatSettings.LongDateFormat;
      $mod.ShortTimeFormat = $mod.FormatSettings.ShortTimeFormat;
      $mod.LongTimeFormat = $mod.FormatSettings.LongTimeFormat;
      $mod.DecimalSeparator = $mod.FormatSettings.DecimalSeparator;
      $mod.ThousandSeparator = $mod.FormatSettings.ThousandSeparator;
      $mod.TimeAMString = $mod.FormatSettings.TimeAMString;
      $mod.TimePMString = $mod.FormatSettings.TimePMString;
      $mod.CurrencyFormat = $mod.FormatSettings.CurrencyFormat;
      $mod.NegCurrFormat = $mod.FormatSettings.NegCurrFormat;
      $mod.CurrencyDecimals = $mod.FormatSettings.CurrencyDecimals;
      $mod.CurrencyString = $mod.FormatSettings.CurrencyString;
    };
  };
  $mod.$init = function () {
    (function () {
      $impl.InitGlobalFormatSettings();
    })();
    $mod.ShortMonthNames = $impl.DefaultShortMonthNames.slice(0);
    $mod.LongMonthNames = $impl.DefaultLongMonthNames.slice(0);
    $mod.ShortDayNames = $impl.DefaultShortDayNames.slice(0);
    $mod.LongDayNames = $impl.DefaultLongDayNames.slice(0);
  };
},[]);
rtl.module("TypInfo",["System","SysUtils","Types","RTLConsts","JS"],function () {
  "use strict";
  var $mod = this;
  this.GetEnumName = function (TypeInfo, Value) {
    var Result = "";
    Result = TypeInfo.enumtype[Value];
    return Result;
  };
  this.GetEnumValue = function (TypeInfo, Name) {
    var Result = 0;
    Result = TypeInfo.enumtype[Name];
    return Result;
  };
});
rtl.module("Classes",["System","RTLConsts","Types","SysUtils","JS","TypInfo"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  rtl.createClass(this,"EStreamError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EListError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"TFPList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = [];
      this.FCount = 0;
      this.FCapacity = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Get = function (Index) {
      var Result = undefined;
      if ((Index < 0) || (Index >= this.FCount)) this.RaiseIndexError(Index);
      Result = this.FList[Index];
      return Result;
    };
    this.Put = function (Index, Item) {
      if ((Index < 0) || (Index >= this.FCount)) this.RaiseIndexError(Index);
      this.FList[Index] = Item;
    };
    this.SetCapacity = function (NewCapacity) {
      if (NewCapacity < this.FCount) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListCapacityError"),"" + NewCapacity);
      if (NewCapacity === this.FCapacity) return;
      this.FList = rtl.arraySetLength(this.FList,undefined,NewCapacity);
      this.FCapacity = NewCapacity;
    };
    this.SetCount = function (NewCount) {
      if (NewCount < 0) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListCountError"),"" + NewCount);
      if (NewCount > this.FCount) {
        if (NewCount > this.FCapacity) this.SetCapacity(NewCount);
      };
      this.FCount = NewCount;
    };
    this.RaiseIndexError = function (Index) {
      this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + Index);
    };
    this.Destroy = function () {
      this.Clear();
      pas.System.TObject.Destroy.call(this);
    };
    this.Add = function (Item) {
      var Result = 0;
      if (this.FCount === this.FCapacity) this.Expand();
      this.FList[this.FCount] = Item;
      Result = this.FCount;
      this.FCount += 1;
      return Result;
    };
    this.Clear = function () {
      if (rtl.length(this.FList) > 0) {
        this.SetCount(0);
        this.SetCapacity(0);
      };
    };
    this.Error = function (Msg, Data) {
      throw $mod.EListError.$create("CreateFmt",[Msg,pas.System.VarRecs(18,Data)]);
    };
    this.Expand = function () {
      var Result = null;
      var IncSize = 0;
      if (this.FCount < this.FCapacity) return this;
      IncSize = 4;
      if (this.FCapacity > 3) IncSize = IncSize + 4;
      if (this.FCapacity > 8) IncSize = IncSize + 8;
      if (this.FCapacity > 127) IncSize += this.FCapacity >>> 2;
      this.SetCapacity(this.FCapacity + IncSize);
      Result = this;
      return Result;
    };
  });
  this.TSeekOrigin = {"0": "soBeginning", soBeginning: 0, "1": "soCurrent", soCurrent: 1, "2": "soEnd", soEnd: 2};
  rtl.createClass(this,"TStream",pas.System.TObject,function () {
    this.SetPosition = function (Pos) {
      this.Seek(Pos,$mod.TSeekOrigin.soBeginning);
    };
    this.GetSize = function () {
      var Result = 0;
      var p = 0;
      p = this.Seek(0,$mod.TSeekOrigin.soCurrent);
      Result = this.Seek(0,$mod.TSeekOrigin.soEnd);
      this.Seek(p,$mod.TSeekOrigin.soBeginning);
      return Result;
    };
    this.Read = function (Buffer, Count) {
      var Result = 0;
      Result = this.Read$1(rtl.arrayRef(Buffer.get()),0,Count);
      return Result;
    };
    this.ReadBuffer = function (Buffer, Count) {
      this.ReadBuffer$1(Buffer,0,Count);
    };
    this.ReadBuffer$1 = function (Buffer, Offset, Count) {
      if (this.Read$1(rtl.arrayRef(Buffer.get()),Offset,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.WriteBuffer = function (Buffer, Count) {
      this.WriteBuffer$1(Buffer,0,Count);
    };
    this.WriteBuffer$1 = function (Buffer, Offset, Count) {
      if (this.Write$1(Buffer,Offset,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    var MaxSize = 0x20000;
    this.CopyFrom = function (Source, Count) {
      var Result = 0;
      var Buffer = [];
      var BufferSize = 0;
      var i = 0;
      Result = 0;
      if (Count === 0) Source.SetPosition(0);
      BufferSize = 131072;
      if ((Count > 0) && (Count < BufferSize)) BufferSize = Count;
      Buffer = rtl.arraySetLength(Buffer,0,BufferSize);
      if (Count === 0) {
        do {
          i = Source.Read({get: function () {
              return Buffer;
            }, set: function (v) {
              Buffer = v;
            }},BufferSize);
          if (i > 0) this.WriteBuffer(Buffer,i);
          Result += i;
        } while (!(i < BufferSize))}
       else while (Count > 0) {
        if (Count > BufferSize) {
          i = BufferSize}
         else i = Count;
        Source.ReadBuffer({get: function () {
            return Buffer;
          }, set: function (v) {
            Buffer = v;
          }},i);
        this.WriteBuffer(Buffer,i);
        Count -= i;
        Result += i;
      };
      return Result;
    };
  });
  rtl.createClass(this,"TCustomMemoryStream",this.TStream,function () {
    this.$init = function () {
      $mod.TStream.$init.call(this);
      this.FMemory = null;
      this.FDataView = null;
      this.FDataArray = null;
      this.FSize = 0;
      this.FPosition = 0;
      this.FSizeBoundsSeek = false;
    };
    this.$final = function () {
      this.FMemory = undefined;
      this.FDataView = undefined;
      this.FDataArray = undefined;
      $mod.TStream.$final.call(this);
    };
    this.GetDataArray = function () {
      var Result = null;
      if (this.FDataArray === null) this.FDataArray = new Uint8Array(this.FMemory);
      Result = this.FDataArray;
      return Result;
    };
    this.GetDataView = function () {
      var Result = null;
      if (this.FDataView === null) this.FDataView = new DataView(this.FMemory);
      Result = this.FDataView;
      return Result;
    };
    this.GetSize = function () {
      var Result = 0;
      Result = this.FSize;
      return Result;
    };
    this.SetPointer = function (Ptr, ASize) {
      this.FMemory = Ptr;
      this.FSize = ASize;
      this.FDataView = null;
      this.FDataArray = null;
    };
    this.Read$1 = function (Buffer, Offset, Count) {
      var Result = 0;
      var I = 0;
      var Src = 0;
      var Dest = 0;
      Result = 0;
      if ((this.FSize > 0) && (this.FPosition < this.FSize) && (this.FPosition >= 0)) {
        Result = Count;
        if (Result > (this.FSize - this.FPosition)) Result = this.FSize - this.FPosition;
        Src = this.FPosition;
        Dest = Offset;
        I = 0;
        while (I < Result) {
          Buffer[Dest] = this.GetDataView().getUint8(Src);
          Src += 1;
          Dest += 1;
          I += 1;
        };
        this.FPosition = this.FPosition + Result;
      };
      return Result;
    };
    this.Seek = function (Offset, Origin) {
      var Result = 0;
      var $tmp = Origin;
      if ($tmp === $mod.TSeekOrigin.soBeginning) {
        this.FPosition = Offset}
       else if ($tmp === $mod.TSeekOrigin.soEnd) {
        this.FPosition = this.FSize + Offset}
       else if ($tmp === $mod.TSeekOrigin.soCurrent) this.FPosition = this.FPosition + Offset;
      if (this.FSizeBoundsSeek && (this.FPosition > this.FSize)) this.FPosition = this.FSize;
      Result = this.FPosition;
      return Result;
    };
  });
  rtl.createClass(this,"TMemoryStream",this.TCustomMemoryStream,function () {
    this.$init = function () {
      $mod.TCustomMemoryStream.$init.call(this);
      this.FCapacity = 0;
    };
    this.SetCapacity = function (NewCapacity) {
      this.SetPointer(this.Realloc({get: function () {
          return NewCapacity;
        }, set: function (v) {
          NewCapacity = v;
        }}),this.FSize);
      this.FCapacity = NewCapacity;
    };
    this.Realloc = function (NewCapacity) {
      var Result = null;
      var GC = 0;
      var DestView = null;
      if (NewCapacity.get() < 0) {
        NewCapacity.set(0)}
       else {
        GC = this.FCapacity + rtl.trunc(this.FCapacity / 4);
        if ((NewCapacity.get() > this.FCapacity) && (NewCapacity.get() < GC)) NewCapacity.set(GC);
        NewCapacity.set((NewCapacity.get() + (4096 - 1)) & ~(4096 - 1));
      };
      if (NewCapacity.get() === this.FCapacity) {
        Result = this.FMemory}
       else if (NewCapacity.get() === 0) {
        Result = null}
       else {
        Result = new ArrayBuffer(NewCapacity.get());
        if (Result === null) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SMemoryStreamError")]);
        DestView = new Uint8Array(Result);
        DestView.set(this.GetDataArray());
      };
      return Result;
    };
    this.Destroy = function () {
      this.Clear();
      pas.System.TObject.Destroy.call(this);
    };
    this.Clear = function () {
      this.FSize = 0;
      this.FPosition = 0;
      this.SetCapacity(0);
    };
    this.Write$1 = function (Buffer, Offset, Count) {
      var Result = 0;
      var NewPos = 0;
      if ((Count === 0) || (this.FPosition < 0)) return 0;
      NewPos = this.FPosition + Count;
      if (NewPos > this.FSize) {
        if (NewPos > this.FCapacity) this.SetCapacity(NewPos);
        this.FSize = NewPos;
      };
      this.GetDataArray().set(rtl.arrayCopy(0,Buffer,Offset,Count),this.FPosition);
      this.FPosition = NewPos;
      Result = Count;
      return Result;
    };
  });
  rtl.createClass(this,"TStringStream",this.TMemoryStream,function () {
    this.GetDataString = function () {
      var Result = "";
      var a = null;
      Result = "";
      a = new Uint16Array(this.FMemory.slice(0,this.GetSize()));
      if (a !== null) {
        // Result=String.fromCharCode.apply(null, new Uint16Array(a));
        Result=String.fromCharCode.apply(null, a);
      };
      return Result;
    };
    this.Create$2 = function (aString) {
      var Len = 0;
      pas.System.TObject.Create.call(this);
      Len = aString.length;
      this.SetPointer($mod.StringToBuffer(aString,Len),Len * 2);
      this.FCapacity = Len * 2;
      return this;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["aString",rtl.string,2]]);
  });
  this.StringToBuffer = function (aString, aLen) {
    var Result = null;
    var I = 0;
    Result = new ArrayBuffer(aLen * 2);
    var $with = new Uint16Array(Result);
    for (var $l = 0, $end = aLen - 1; $l <= $end; $l++) {
      I = $l;
      $with[I] = aString.charCodeAt(I);
    };
    return Result;
  };
  $mod.$implcode = function () {
    $impl.TMSGrow = 4096;
    $impl.ClassList = null;
    $mod.$resourcestrings = {SReadError: {org: "Could not read data from stream"}, SWriteError: {org: "Could not write data to stream"}, SMemoryStreamError: {org: "Could not allocate memory"}};
  };
  $mod.$init = function () {
    $impl.ClassList = new Object();
  };
},[]);
rtl.module("contnrs",["System","SysUtils","Classes"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TFPObjectList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FFreeObjects = false;
      this.FList = null;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FList.FCount;
      return Result;
    };
    this.GetItem = function (Index) {
      var Result = null;
      Result = rtl.getObject(this.FList.Get(Index));
      return Result;
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FList = pas.Classes.TFPList.$create("Create");
      this.FFreeObjects = true;
      return this;
    };
    this.Create$2 = function (FreeObjects) {
      this.Create$1();
      this.FFreeObjects = FreeObjects;
      return this;
    };
    this.Destroy = function () {
      if (this.FList !== null) {
        this.Clear();
        this.FList.$destroy("Destroy");
      };
      pas.System.TObject.Destroy.call(this);
    };
    this.Clear = function () {
      var i = 0;
      var O = null;
      if (this.FFreeObjects) for (var $l = this.FList.FCount - 1; $l >= 0; $l--) {
        i = $l;
        O = rtl.getObject(this.FList.Get(i));
        this.FList.Put(i,null);
        O = rtl.freeLoc(O);
      };
      this.FList.Clear();
    };
    this.Add = function (AObject) {
      var Result = 0;
      Result = this.FList.Add(AObject);
      return Result;
    };
  });
},["JS"]);
rtl.module("fpjson",["System","JS","RTLConsts","Types","SysUtils","Classes","contnrs"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TJSONInstanceType = {"0": "jitUnknown", jitUnknown: 0, "1": "jitNumberInteger", jitNumberInteger: 1, "2": "jitNumberNativeInt", jitNumberNativeInt: 2, "3": "jitNumberFloat", jitNumberFloat: 3, "4": "jitString", jitString: 4, "5": "jitBoolean", jitBoolean: 5, "6": "jitNull", jitNull: 6, "7": "jitArray", jitArray: 7, "8": "jitObject", jitObject: 8};
  this.TFormatOption = {"0": "foSingleLineArray", foSingleLineArray: 0, "1": "foSingleLineObject", foSingleLineObject: 1, "2": "foDoNotQuoteMembers", foDoNotQuoteMembers: 2, "3": "foUseTabchar", foUseTabchar: 3, "4": "foSkipWhiteSpace", foSkipWhiteSpace: 4, "5": "foSkipWhiteSpaceOnlyLeading", foSkipWhiteSpaceOnlyLeading: 5};
  this.DefaultIndentSize = 2;
  this.DefaultFormat = {};
  rtl.createClass(this,"TJSONData",pas.System.TObject,function () {
    this.ElementSeps = [", ",","];
    this.FCompressedJSON = false;
    this.FElementSep = "";
    this.DetermineElementSeparators = function () {
      $mod.TJSONData.FElementSep = this.ElementSeps[+this.FCompressedJSON];
    };
    this.SetCompressedJSON = function (AValue) {
      if (AValue === this.FCompressedJSON) return;
      $mod.TJSONData.FCompressedJSON = AValue;
      this.DetermineElementSeparators();
      $mod.TJSONObject.DetermineElementQuotes();
    };
    this.DoError = function (Msg) {
      throw $mod.EJSON.$create("Create$1",[Msg]);
    };
    this.DoError$1 = function (Fmt, Args) {
      throw $mod.EJSON.$create("CreateFmt",[Fmt,Args]);
    };
    this.DoFindPath = function (APath, NotFound) {
      var Result = null;
      if (APath !== "") {
        NotFound.set(APath);
        Result = null;
      } else Result = this;
      return Result;
    };
    this.GetItem = function (Index) {
      var Result = null;
      Result = null;
      if (Index > 0) ;
      return Result;
    };
    this.DoFormatJSON = function (Options, CurrentIndent, Indent) {
      var Result = "";
      Result = this.GetAsJSON();
      if (rtl.eqSet(Options,{})) ;
      if (CurrentIndent === 0) ;
      if (Indent > 0) ;
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = 0;
      return Result;
    };
    this.Create$1 = function () {
      this.Clear();
      return this;
    };
    this.GetPath = function (APath) {
      var Result = null;
      var M = "";
      Result = this.DoFindPath(APath,{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }});
      if (Result === null) this.$class.DoError$1(rtl.getResStr($mod,"SErrPathElementNotFound"),pas.System.VarRecs(18,APath,18,M));
      return Result;
    };
    this.FormatJSON = function (Options, Indentsize) {
      var Result = "";
      Result = this.DoFormatJSON(rtl.refSet(Options),0,Indentsize);
      return Result;
    };
  });
  rtl.createClass(this,"TJSONNumber",this.TJSONData,function () {
  });
  rtl.createClass(this,"TJSONFloatNumber",this.TJSONNumber,function () {
    this.$init = function () {
      $mod.TJSONNumber.$init.call(this);
      this.FValue = 0.0;
    };
    this.GetAsBoolean = function () {
      var Result = false;
      Result = this.FValue !== 0;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = this.FValue;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = Math.round(this.FValue);
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      Result = this.GetAsString();
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      Result = rtl.floatToStr(this.FValue);
      if ((Result !== "") && (Result.charAt(0) === " ")) pas.System.Delete({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},1,1);
      return Result;
    };
    this.Create$2 = function (AValue) {
      this.FValue = AValue;
      return this;
    };
    this.Clear = function () {
      this.FValue = 0;
    };
  });
  rtl.createClass(this,"TJSONIntegerNumber",this.TJSONNumber,function () {
    this.$init = function () {
      $mod.TJSONNumber.$init.call(this);
      this.FValue = 0;
    };
    this.GetAsBoolean = function () {
      var Result = false;
      Result = this.FValue !== 0;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = this.FValue;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = this.FValue;
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      Result = this.GetAsString();
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      Result = pas.SysUtils.IntToStr(this.FValue);
      return Result;
    };
    this.Create$2 = function (AValue) {
      this.FValue = AValue;
      return this;
    };
    this.Clear = function () {
      this.FValue = 0;
    };
  });
  rtl.createClass(this,"TJSONNativeIntNumber",this.TJSONNumber,function () {
    this.$init = function () {
      $mod.TJSONNumber.$init.call(this);
      this.FValue = 0;
    };
    this.GetAsBoolean = function () {
      var Result = false;
      Result = this.FValue !== 0;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = this.FValue;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = this.FValue;
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      Result = this.GetAsString();
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      Result = pas.SysUtils.IntToStr(this.FValue);
      return Result;
    };
    this.Create$2 = function (AValue) {
      this.FValue = AValue;
      return this;
    };
    this.Clear = function () {
      this.FValue = 0;
    };
  });
  rtl.createClass(this,"TJSONString",this.TJSONData,function () {
    this.StrictEscaping = false;
    this.$init = function () {
      $mod.TJSONData.$init.call(this);
      this.FValue = "";
    };
    this.GetAsBoolean = function () {
      var Result = false;
      Result = pas.SysUtils.StrToBool(this.FValue);
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      var C = 0;
      pas.System.val$8(this.FValue,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},{get: function () {
          return C;
        }, set: function (v) {
          C = v;
        }});
      if (C !== 0) if (!pas.SysUtils.TryStrToFloat$2(this.FValue,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})) throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr($mod,"SErrInvalidFloat"),pas.System.VarRecs(18,this.FValue)]);
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = pas.SysUtils.StrToInt(this.FValue);
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      Result = '"' + $mod.StringToJSONString(this.FValue,this.StrictEscaping) + '"';
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      Result = this.FValue;
      return Result;
    };
    this.Create$2 = function (AValue) {
      this.FValue = AValue;
      return this;
    };
    this.Clear = function () {
      this.FValue = "";
    };
  });
  rtl.createClass(this,"TJSONBoolean",this.TJSONData,function () {
    this.$init = function () {
      $mod.TJSONData.$init.call(this);
      this.FValue = false;
    };
    this.GetAsBoolean = function () {
      var Result = false;
      Result = this.FValue;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = this.FValue + 0;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = this.FValue + 0;
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      if (this.FValue) {
        Result = "true"}
       else Result = "false";
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      Result = pas.SysUtils.BoolToStr(this.FValue,true);
      return Result;
    };
    this.Create$2 = function (AValue) {
      this.FValue = AValue;
      return this;
    };
    this.Clear = function () {
      this.FValue = false;
    };
  });
  rtl.createClass(this,"TJSONNull",this.TJSONData,function () {
    this.Converterror = function (From) {
      if (From) {
        this.$class.DoError(rtl.getResStr($mod,"SErrCannotConvertFromNull"))}
       else this.$class.DoError(rtl.getResStr($mod,"SErrCannotConvertToNull"));
    };
    this.GetAsBoolean = function () {
      var Result = false;
      this.Converterror(true);
      Result = false;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      this.Converterror(true);
      Result = 0.0;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      this.Converterror(true);
      Result = 0;
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      Result = "null";
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      this.Converterror(true);
      Result = "";
      return Result;
    };
    this.Clear = function () {
    };
  });
  rtl.createClass(this,"TJSONArray",this.TJSONData,function () {
    this.$init = function () {
      $mod.TJSONData.$init.call(this);
      this.FList = null;
    };
    this.$final = function () {
      this.FList = undefined;
      $mod.TJSONData.$final.call(this);
    };
    this.DoFindPath = function (APath, NotFound) {
      var Result = null;
      var P = 0;
      var I = 0;
      var E = "";
      if ((APath !== "") && (APath.charAt(0) === "[")) {
        P = pas.System.Pos("]",APath);
        I = -1;
        if (P > 2) I = pas.SysUtils.StrToIntDef(pas.System.Copy(APath,2,P - 2),-1);
        if ((I >= 0) && (I < this.GetCount())) {
          E = APath;
          pas.System.Delete({get: function () {
              return E;
            }, set: function (v) {
              E = v;
            }},1,P);
          Result = this.GetItem(I).DoFindPath(E,NotFound);
        } else {
          Result = null;
          if (P > 0) {
            NotFound.set(pas.System.Copy(APath,1,P))}
           else NotFound.set(APath);
        };
      } else Result = $mod.TJSONData.DoFindPath.call(this,APath,NotFound);
      return Result;
    };
    this.Converterror = function (From) {
      if (From) {
        this.$class.DoError(rtl.getResStr($mod,"SErrCannotConvertFromArray"))}
       else this.$class.DoError(rtl.getResStr($mod,"SErrCannotConvertToArray"));
    };
    this.GetAsBoolean = function () {
      var Result = false;
      this.Converterror(true);
      Result = false;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      this.Converterror(true);
      Result = 0.0;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      this.Converterror(true);
      Result = 0;
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      var I = 0;
      var Sep = "";
      var D = null;
      var V = "";
      Sep = $mod.TJSONData.FElementSep;
      Result = "[";
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        D = this.GetItem(I);
        if (D !== null) {
          V = D.GetAsJSON()}
         else V = "null";
        Result = Result + V;
        if (I < (this.GetCount() - 1)) Result = Result + Sep;
      };
      Result = Result + "]";
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      this.Converterror(true);
      Result = "";
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FList.GetCount();
      return Result;
    };
    this.GetItem = function (Index) {
      var Result = null;
      Result = rtl.as(this.FList.GetItem(Index),$mod.TJSONData);
      return Result;
    };
    this.DoFormatJSON = function (Options, CurrentIndent, Indent) {
      var Result = "";
      var I = 0;
      var MultiLine = false;
      var SkipWhiteSpace = false;
      var Ind = "";
      Result = "[";
      MultiLine = !($mod.TFormatOption.foSingleLineArray in Options);
      SkipWhiteSpace = $mod.TFormatOption.foSkipWhiteSpace in Options;
      Ind = $impl.IndentString(rtl.refSet(Options),CurrentIndent + Indent);
      if (MultiLine) Result = Result + pas.System.sLineBreak;
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        if (MultiLine) Result = Result + Ind;
        if (this.GetItem(I) === null) {
          Result = Result + "null"}
         else Result = Result + this.GetItem(I).DoFormatJSON(rtl.refSet(Options),CurrentIndent + Indent,Indent);
        if (I < (this.GetCount() - 1)) if (MultiLine) {
          Result = Result + ","}
         else Result = Result + this.ElementSeps[+SkipWhiteSpace];
        if (MultiLine) Result = Result + pas.System.sLineBreak;
      };
      if (MultiLine) Result = Result + $impl.IndentString(rtl.refSet(Options),CurrentIndent);
      Result = Result + "]";
      return Result;
    };
    this.Create$2 = function () {
      this.FList = pas.contnrs.TFPObjectList.$create("Create$2",[true]);
      return this;
    };
    this.Create$3 = function (Elements) {
      var I = 0;
      var J = null;
      this.Create$2();
      for (var $l = 0, $end = rtl.length(Elements) - 1; $l <= $end; $l++) {
        I = $l;
        J = $impl.VarRecToJSON(Elements[I],"Array");
        this.Add(J);
      };
      return this;
    };
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FList;
        }, set: function (v) {
          this.p.FList = v;
        }});
      pas.System.TObject.Destroy.call(this);
    };
    this.Clear = function () {
      this.FList.Clear();
    };
    this.Add = function (Item) {
      var Result = 0;
      Result = this.FList.Add(Item);
      return Result;
    };
  });
  rtl.createClass(this,"TJSONObject",this.TJSONData,function () {
    this.ElementStart = ['"',""];
    this.SpacedQuoted = ['" : '," : "];
    this.UnSpacedQuoted = ['":',":"];
    this.ObjStartSeps = ["{ ","{"];
    this.ObjEndSeps = [" }","}"];
    this.FUnquotedMemberNames = false;
    this.FObjStartSep = "";
    this.FObjEndSep = "";
    this.FElementEnd = "";
    this.FElementStart = "";
    this.$init = function () {
      $mod.TJSONData.$init.call(this);
      this.FCount = 0;
      this.FHash = null;
      this.FNames = [];
    };
    this.$final = function () {
      this.FHash = undefined;
      this.FNames = undefined;
      $mod.TJSONData.$final.call(this);
    };
    this.DoAdd = function (AName, AValue, FreeOnError) {
      var Result = 0;
      if (this.FHash.hasOwnProperty("%" + AName)) {
        if (FreeOnError) pas.SysUtils.FreeAndNil({get: function () {
            return AValue;
          }, set: function (v) {
            AValue = v;
          }});
        this.$class.DoError$1(rtl.getResStr($mod,"SErrDuplicateValue"),pas.System.VarRecs(18,AName));
      };
      this.FHash["%" + AName] = AValue;
      this.FNames = [];
      this.FCount += 1;
      Result = this.FCount;
      return Result;
    };
    this.DetermineElementQuotes = function () {
      $mod.TJSONObject.FObjStartSep = this.ObjStartSeps[+$mod.TJSONData.FCompressedJSON];
      $mod.TJSONObject.FObjEndSep = this.ObjEndSeps[+$mod.TJSONData.FCompressedJSON];
      if ($mod.TJSONData.FCompressedJSON) {
        $mod.TJSONObject.FElementEnd = this.UnSpacedQuoted[+this.FUnquotedMemberNames]}
       else $mod.TJSONObject.FElementEnd = this.SpacedQuoted[+this.FUnquotedMemberNames];
      $mod.TJSONObject.FElementStart = this.ElementStart[+this.FUnquotedMemberNames];
    };
    this.GetElements = function (AName) {
      var Result = null;
      if (this.FHash.hasOwnProperty("%" + AName)) {
        Result = rtl.getObject(this.FHash["%" + AName])}
       else this.$class.DoError$1(rtl.getResStr($mod,"SErrNonexistentElement"),pas.System.VarRecs(18,AName));
      return Result;
    };
    this.GetNameOf = function (Index) {
      var Result = "";
      if (rtl.length(this.FNames) === 0) this.FNames = Object.getOwnPropertyNames(this.FHash);
      if ((Index < 0) || (Index >= this.FCount)) this.$class.DoError$1(rtl.getResStr(pas.RTLConsts,"SListIndexError"),pas.System.VarRecs(0,Index));
      Result = pas.System.Copy$1(this.FNames[Index],2);
      return Result;
    };
    this.SetBooleans = function (AName, AValue) {
      this.SetElements(AName,$mod.CreateJSON$1(AValue));
    };
    this.SetElements = function (AName, AValue) {
      if (!this.FHash.hasOwnProperty("%" + AName)) this.FCount += 1;
      this.FHash["%" + AName] = AValue;
      this.FNames = [];
    };
    this.SetFloats = function (AName, AValue) {
      this.SetElements(AName,$mod.CreateJSON$4(AValue));
    };
    this.SetIntegers = function (AName, AValue) {
      this.SetElements(AName,$mod.CreateJSON$2(AValue));
    };
    this.SetStrings = function (AName, AValue) {
      this.SetElements(AName,$mod.CreateJSON$5(AValue));
    };
    this.DoFindPath = function (APath, NotFound) {
      var Result = null;
      var N = "";
      var L = 0;
      var P = 0;
      var P2 = 0;
      if (APath === "") return this;
      N = APath;
      L = N.length;
      P = 1;
      while ((P < L) && (N.charAt(P - 1) === ".")) P += 1;
      P2 = P;
      while ((P2 <= L) && !(N.charCodeAt(P2 - 1) in rtl.createSet(46,91))) P2 += 1;
      N = pas.System.Copy(APath,P,P2 - P);
      if (N === "") {
        Result = this}
       else {
        Result = this.Find(N);
        if (Result === null) {
          NotFound.set(N + pas.System.Copy(APath,P2,L - P2))}
         else {
          N = pas.System.Copy(APath,P2,(L - P2) + 1);
          Result = Result.DoFindPath(N,NotFound);
        };
      };
      return Result;
    };
    this.Converterror = function (From) {
      if (From) {
        this.$class.DoError(rtl.getResStr($mod,"SErrCannotConvertFromObject"))}
       else this.$class.DoError(rtl.getResStr($mod,"SErrCannotConvertToObject"));
    };
    this.GetAsBoolean = function () {
      var Result = false;
      this.Converterror(true);
      Result = false;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      this.Converterror(true);
      Result = 0.0;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      this.Converterror(true);
      Result = 0;
      return Result;
    };
    this.GetAsJSON = function () {
      var Result = "";
      var I = 0;
      var Sep = "";
      var V = "";
      var D = null;
      Sep = $mod.TJSONData.FElementSep;
      Result = "";
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        if (Result !== "") Result = Result + Sep;
        D = this.GetItem(I);
        if (D != null) {
          V = this.GetItem(I).GetAsJSON()}
         else V = "null";
        Result = Result + this.FElementStart + $mod.StringToJSONString(this.GetNameOf(I),false) + this.FElementEnd + V;
      };
      if (Result !== "") {
        Result = this.FObjStartSep + Result + this.FObjEndSep}
       else Result = "{}";
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      this.Converterror(true);
      Result = "";
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FCount;
      return Result;
    };
    this.GetItem = function (Index) {
      var Result = null;
      Result = this.GetElements(this.GetNameOf(Index));
      return Result;
    };
    this.DoFormatJSON = function (Options, CurrentIndent, Indent) {
      var Result = "";
      var i = 0;
      var S = "";
      var MultiLine = false;
      var UseQuotes = false;
      var SkipWhiteSpace = false;
      var SkipWhiteSpaceOnlyLeading = false;
      var NSep = "";
      var Sep = "";
      var Ind = "";
      var V = "";
      var D = null;
      Result = "";
      UseQuotes = !($mod.TFormatOption.foDoNotQuoteMembers in Options);
      MultiLine = !($mod.TFormatOption.foSingleLineObject in Options);
      SkipWhiteSpace = $mod.TFormatOption.foSkipWhiteSpace in Options;
      SkipWhiteSpaceOnlyLeading = $mod.TFormatOption.foSkipWhiteSpaceOnlyLeading in Options;
      CurrentIndent = CurrentIndent + Indent;
      Ind = $impl.IndentString(rtl.refSet(Options),CurrentIndent);
      if (SkipWhiteSpace) {
        if (SkipWhiteSpaceOnlyLeading) {
          NSep = ": "}
         else NSep = ":";
      } else NSep = " : ";
      if (MultiLine) {
        Sep = "," + pas.System.sLineBreak + Ind}
       else if (SkipWhiteSpace) {
        Sep = ","}
       else Sep = ", ";
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        if (i > 0) {
          Result = Result + Sep}
         else if (MultiLine) Result = Result + Ind;
        S = $mod.StringToJSONString(this.GetNameOf(i),false);
        if (UseQuotes) S = '"' + S + '"';
        D = this.GetItem(i);
        if (D === null) {
          V = "null"}
         else V = this.GetItem(i).DoFormatJSON(rtl.refSet(Options),CurrentIndent,Indent);
        Result = Result + S + NSep + V;
      };
      if (Result !== "") {
        if (MultiLine) {
          Result = "{" + pas.System.sLineBreak + Result + pas.System.sLineBreak + $impl.IndentString(rtl.refSet(Options),CurrentIndent - Indent) + "}"}
         else Result = this.ObjStartSeps[+SkipWhiteSpace] + Result + this.ObjEndSeps[+SkipWhiteSpace];
      } else Result = "{}";
      return Result;
    };
    this.Create$2 = function () {
      this.FHash = new Object();
      return this;
    };
    this.Create$3 = function (Elements) {
      var I = 0;
      var AName = "";
      var J = null;
      this.Create$2();
      if (((rtl.length(Elements) - 1 - 0) % 2) === 0) this.$class.DoError(rtl.getResStr($mod,"SErrOddNumber"));
      I = 0;
      while (I <= (rtl.length(Elements) - 1)) {
        if (rtl.isString(Elements[I])) {
          AName = "" + Elements[I]}
         else this.$class.DoError$1(rtl.getResStr($mod,"SErrNameMustBeString"),pas.System.VarRecs(0,I + 1));
        if (AName === "") this.$class.DoError$1(rtl.getResStr($mod,"SErrNameMustBeString"),pas.System.VarRecs(0,I + 1));
        I += 1;
        J = $impl.VarRecToJSON(Elements[I],"Object");
        this.Add(AName,J);
        I += 1;
      };
      return this;
    };
    this.Destroy = function () {
      this.FHash = null;
      pas.System.TObject.Destroy.call(this);
    };
    this.Find = function (AName) {
      var Result = null;
      if (this.FHash.hasOwnProperty("%" + AName)) {
        Result = rtl.getObject(this.FHash["%" + AName])}
       else Result = null;
      return Result;
    };
    this.Clear = function () {
      this.FCount = 0;
      this.FHash = new Object();
      this.FNames = [];
    };
    this.Add = function (AName, AValue) {
      var Result = 0;
      Result = this.DoAdd(AName,AValue,false);
      return Result;
    };
  });
  rtl.createClass(this,"EJSON",pas.SysUtils.Exception,function () {
  });
  this.StringToJSONString = function (S, Strict) {
    var Result = "";
    var I = 0;
    var J = 0;
    var L = 0;
    var C = "\x00";
    I = 1;
    J = 1;
    Result = "";
    L = S.length;
    while (I <= L) {
      C = S.charAt(I - 1);
      if (C.charCodeAt() in rtl.createSet(34,47,92,null,0,31)) {
        Result = Result + pas.System.Copy(S,J,I - J);
        var $tmp = C;
        if ($tmp === "\\") {
          Result = Result + "\\\\"}
         else if ($tmp === "/") {
          if (Strict) {
            Result = Result + "\\/"}
           else Result = Result + "/"}
         else if ($tmp === '"') {
          Result = Result + '\\"'}
         else if ($tmp === "\b") {
          Result = Result + "\\b"}
         else if ($tmp === "\t") {
          Result = Result + "\\t"}
         else if ($tmp === "\n") {
          Result = Result + "\\n"}
         else if ($tmp === "\f") {
          Result = Result + "\\f"}
         else if ($tmp === "\r") {
          Result = Result + "\\r"}
         else {
          Result = Result + "\\u" + rtl.hexStr(C.charCodeAt(),4);
        };
        J = I + 1;
      };
      I += 1;
    };
    Result = Result + pas.System.Copy(S,J,I - 1);
    return Result;
  };
  this.CreateJSON = function () {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitNull].$create("Create$1");
    return Result;
  };
  this.CreateJSON$1 = function (Data) {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitBoolean].$create("Create$2",[Data]);
    return Result;
  };
  this.CreateJSON$2 = function (Data) {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitNumberInteger].$create("Create$2",[Data]);
    return Result;
  };
  this.CreateJSON$3 = function (Data) {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitNumberNativeInt].$create("Create$2",[Data]);
    return Result;
  };
  this.CreateJSON$4 = function (Data) {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitNumberFloat].$create("Create$2",[Data]);
    return Result;
  };
  this.CreateJSON$5 = function (Data) {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitString].$create("Create$2",[Data]);
    return Result;
  };
  this.CreateJSONArray = function (Data) {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitArray].$create("Create$3",[Data]);
    return Result;
  };
  this.CreateJSONObject = function (Data) {
    var Result = null;
    Result = $impl.DefaultJSONInstanceTypes[$mod.TJSONInstanceType.jitObject].$create("Create$3",[Data]);
    return Result;
  };
  this.GetJSON = function (jSON, UseUTF8) {
    var Result = null;
    var SS = null;
    if ($impl.JPSH != null) {
      $impl.JPSH(jSON,UseUTF8,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})}
     else {
      SS = pas.Classes.TStringStream.$create("Create$2",[jSON]);
      try {
        Result = $mod.GetJSON$1(SS,UseUTF8);
      } finally {
        SS = rtl.freeLoc(SS);
      };
    };
    return Result;
  };
  this.GetJSON$1 = function (jSON, UseUTF8) {
    var Result = null;
    var SS = null;
    Result = null;
    if ($impl.JPH !== null) {
      $impl.JPH(jSON,UseUTF8,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})}
     else if ($impl.JPSH === null) {
      $mod.TJSONData.DoError(rtl.getResStr($mod,"SErrNoParserHandler"))}
     else {
      SS = pas.Classes.TStringStream.$create("Create$2",[""]);
      try {
        SS.CopyFrom(jSON,0);
        $impl.JPSH(SS.GetDataString(),false,{get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }});
      } finally {
        SS = rtl.freeLoc(SS);
      };
    };
    return Result;
  };
  this.SetJSONParserHandler = function (AHandler) {
    var Result = null;
    Result = $impl.JPH;
    $impl.JPH = AHandler;
    return Result;
  };
  this.SetJSONStringParserHandler = function (AHandler) {
    var Result = null;
    Result = $impl.JPSH;
    $impl.JPSH = AHandler;
    return Result;
  };
  $mod.$implcode = function () {
    $impl.DefaultJSONInstanceTypes = [$mod.TJSONData,$mod.TJSONIntegerNumber,$mod.TJSONNativeIntNumber,$mod.TJSONFloatNumber,$mod.TJSONString,$mod.TJSONBoolean,$mod.TJSONNull,$mod.TJSONArray,$mod.TJSONObject];
    $impl.JPH = null;
    $impl.JPSH = null;
    $impl.IndentString = function (Options, Indent) {
      var Result = "";
      if ($mod.TFormatOption.foUseTabchar in Options) {
        Result = pas.System.StringOfChar("\t",Indent)}
       else Result = pas.System.StringOfChar(" ",Indent);
      return Result;
    };
    $impl.VarRecToJSON = function (Element, SourceType) {
      var Result = null;
      var i = 0;
      var VObject = null;
      Result = null;
      if (Element == null) {
        Result = $mod.CreateJSON()}
       else if (pas.JS.isBoolean(Element)) {
        Result = $mod.CreateJSON$1(!(Element == false))}
       else if (rtl.isString(Element)) {
        Result = $mod.CreateJSON$5("" + Element)}
       else if (rtl.isNumber(Element)) {
        if (pas.JS.isInteger(Element)) {
          i = rtl.trunc(Element);
          if ((i >= -2147483648) && (i <= 2147483647)) {
            Result = $mod.CreateJSON$2(rtl.trunc(Element))}
           else Result = $mod.CreateJSON$3(rtl.trunc(Element));
        } else Result = $mod.CreateJSON$4(rtl.getNumber(Element));
      } else if (rtl.isObject(Element) && rtl.isExt(Element,pas.System.TObject,1)) {
        VObject = rtl.getObject(Element);
        if ($mod.TJSONData.isPrototypeOf(VObject)) {
          Result = VObject}
         else $mod.TJSONData.DoError$1(rtl.getResStr($mod,"SErrNotJSONData"),pas.System.VarRecs(18,VObject.$classname,18,SourceType));
      } else $mod.TJSONData.DoError$1(rtl.getResStr($mod,"SErrUnknownTypeInConstructor"),pas.System.VarRecs(18,SourceType,18,typeof(Element)));
      return Result;
    };
    $mod.$resourcestrings = {SErrCannotConvertFromNull: {org: "Cannot convert data from Null value"}, SErrCannotConvertToNull: {org: "Cannot convert data to Null value"}, SErrCannotConvertFromArray: {org: "Cannot convert data from array value"}, SErrCannotConvertToArray: {org: "Cannot convert data to array value"}, SErrCannotConvertFromObject: {org: "Cannot convert data from object value"}, SErrCannotConvertToObject: {org: "Cannot convert data to object value"}, SErrInvalidFloat: {org: "Invalid float value : %s"}, SErrNotJSONData: {org: "Cannot add object of type %s to TJSON%s"}, SErrOddNumber: {org: "TJSONObject must be constructed with name,value pairs"}, SErrNameMustBeString: {org: "TJSONObject constructor element name at pos %d is not a string"}, SErrNonexistentElement: {org: 'Unknown object member: "%s"'}, SErrDuplicateValue: {org: 'Duplicate object member: "%s"'}, SErrPathElementNotFound: {org: 'Path "%s" invalid: element "%s" not found.'}, SErrUnknownTypeInConstructor: {org: "Unknown type in JSON%s constructor: %s"}, SErrNoParserHandler: {org: "No JSON parser handler installed. Recompile your project with the jsonparser unit included"}};
  };
  $mod.$init = function () {
    $mod.TJSONData.DetermineElementSeparators();
    $mod.TJSONObject.DetermineElementQuotes();
  };
},["TypInfo"]);
rtl.module("fpjsonjs",["System","Classes","Types","fpjson"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.JSValueToJSONData = function (aValue) {
    var Result = null;
    var v = undefined;
    var S = "";
    var $tmp = pas.JS.GetValueType(aValue);
    if ($tmp === pas.JS.TJSValueType.jvtNull) {
      Result = pas.fpjson.CreateJSON()}
     else if ($tmp === pas.JS.TJSValueType.jvtBoolean) {
      Result = pas.fpjson.CreateJSON$1(!(aValue == false))}
     else if ($tmp === pas.JS.TJSValueType.jvtString) {
      Result = pas.fpjson.CreateJSON$5("" + aValue)}
     else if ($tmp === pas.JS.TJSValueType.jvtFloat) {
      Result = pas.fpjson.CreateJSON$4(rtl.getNumber(aValue))}
     else if ($tmp === pas.JS.TJSValueType.jvtInteger) {
      if ((rtl.trunc(aValue) > 2147483647) || (rtl.trunc(aValue) < -2147483647)) {
        Result = pas.fpjson.CreateJSON$3(rtl.trunc(aValue))}
       else Result = pas.fpjson.CreateJSON$3(rtl.trunc(aValue))}
     else if ($tmp === pas.JS.TJSValueType.jvtArray) {
      Result = pas.fpjson.CreateJSONArray([]);
      for (var $in = aValue, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
        v = $in[$l];
        Result.Add($mod.JSValueToJSONData(v));
      };
    } else if ($tmp === pas.JS.TJSValueType.jvtObject) {
      Result = pas.fpjson.CreateJSONObject([]);
      for (var $in1 = Object.getOwnPropertyNames(aValue), $l1 = 0, $end1 = rtl.length($in1) - 1; $l1 <= $end1; $l1++) {
        S = $in1[$l1];
        Result.Add(S,$mod.JSValueToJSONData(aValue[S]));
      };
    };
    return Result;
  };
  this.HookGetJSONCallBack = function () {
    pas.fpjson.SetJSONParserHandler($impl.JSONFromStream);
    pas.fpjson.SetJSONStringParserHandler($impl.JSONFromString);
  };
  $mod.$implcode = function () {
    $impl.JSONFromString = function (aJSON, AUseUTF8, Data) {
      var Msg = "";
      var aValue = undefined;
      Msg = "";
      try {
        aValue = JSON.parse(aJSON);
      } catch ($e) {
        if (rtl.isExt($e,SyntaxError)) {
          var ES = $e;
          Msg = ES.message;
        } else if (rtl.isExt($e,Error)) {
          var E = $e;
          Msg = E.message;
        } else if (rtl.isExt($e,Object)) {
          var O = $e;
          Msg = "Unknown error : " + JSON.stringify(O);
        } else {
          var b = new SyntaxError;
                  console.log(SyntaxError.prototype.isPrototypeOf(b));
          
                  if ($e.hasOwnProperty('message')) {
                    Msg = '' || $e.message;
                  };
        }
      };
      if (Msg !== "") throw pas.fpjson.EJSON.$create("Create$1",["Error parsing JSON: " + Msg]);
      Data.set($mod.JSValueToJSONData(aValue));
    };
    $impl.JSONFromStream = function (AStream, AUseUTF8, Data) {
      var SS = null;
      SS = pas.Classes.TStringStream.$create("Create$2",[""]);
      try {
        SS.CopyFrom(AStream,0);
        $impl.JSONFromString(SS.GetDataString(),false,Data);
      } finally {
        SS = rtl.freeLoc(SS);
      };
    };
  };
  $mod.$init = function () {
    $mod.HookGetJSONCallBack();
  };
},["JS"]);
rtl.module("weborworker",["System","JS","Types"],function () {
  "use strict";
  var $mod = this;
});
rtl.module("Web",["System","Types","JS","weborworker"],function () {
  "use strict";
  var $mod = this;
});
rtl.module("Hvac.Models.Core",["System"],function () {
  "use strict";
  var $mod = this;
  this.THvacMode = {"0": "mdAuto", mdAuto: 0, "1": "mdCool", mdCool: 1, "2": "mdDry", mdDry: 2, "3": "mdFan", mdFan: 3, "4": "mdHeat", mdHeat: 4};
  this.$rtti.$Enum("THvacMode",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.THvacMode});
  this.TFanSpeed = {"0": "fsAuto", fsAuto: 0, "1": "fsLevel1", fsLevel1: 1, "2": "fsLevel2", fsLevel2: 2, "3": "fsLevel3", fsLevel3: 3, "4": "fsLevel4", fsLevel4: 4, "5": "fsLevel5", fsLevel5: 5, "6": "fsLevel6", fsLevel6: 6};
  this.$rtti.$Enum("TFanSpeed",{minvalue: 0, maxvalue: 6, ordtype: 1, enumtype: this.TFanSpeed});
  this.THorizontalFlowMode = {"0": "hfmStop", hfmStop: 0, "1": "hfmSwing", hfmSwing: 1, "2": "hfmLeft", hfmLeft: 2, "3": "hfmLeftCenter", hfmLeftCenter: 3, "4": "hfmCenter", hfmCenter: 4, "5": "hfmRightCenter", hfmRightCenter: 5, "6": "hfmRight", hfmRight: 6, "7": "hfmLeftRight", hfmLeftRight: 7, "8": "hfmSwingWide", hfmSwingWide: 8};
  this.$rtti.$Enum("THorizontalFlowMode",{minvalue: 0, maxvalue: 8, ordtype: 1, enumtype: this.THorizontalFlowMode});
  this.TVerticalFlowMode = {"0": "vfmStop", vfmStop: 0, "1": "vfmSwing", vfmSwing: 1, "2": "vfmTop", vfmTop: 2, "3": "vfmTopCenter", vfmTopCenter: 3, "4": "vfmCenter", vfmCenter: 4, "5": "vfmBottomCenter", vfmBottomCenter: 5, "6": "vfmBottom", vfmBottom: 6};
  this.$rtti.$Enum("TVerticalFlowMode",{minvalue: 0, maxvalue: 6, ordtype: 1, enumtype: this.TVerticalFlowMode});
  this.TTemperatureScale = {"0": "tsCelsius", tsCelsius: 0, "1": "tsFahrenheit", tsFahrenheit: 1};
  this.$rtti.$Enum("TTemperatureScale",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TTemperatureScale});
});
rtl.module("Hvac.Models.Domain",["System","Hvac.Models.Core"],function () {
  "use strict";
  var $mod = this;
  rtl.recNewT(this,"THvacState",function () {
    this.Power = false;
    this.Mode = 0;
    this.IndoorTemperature = 0.0;
    this.DesiredTemperature = 0;
    this.Turbo = false;
    this.FanSpeed = 0;
    this.HorizontalFlowMode = 0;
    this.VerticalFlowMode = 0;
    this.TemperatureScale = 0;
    this.Quiet = false;
    this.Display = false;
    this.Health = false;
    this.Drying = false;
    this.Sleep = false;
    this.Eco = false;
    this.$eq = function (b) {
      return (this.Power === b.Power) && (this.Mode === b.Mode) && (this.IndoorTemperature === b.IndoorTemperature) && (this.DesiredTemperature === b.DesiredTemperature) && (this.Turbo === b.Turbo) && (this.FanSpeed === b.FanSpeed) && (this.HorizontalFlowMode === b.HorizontalFlowMode) && (this.VerticalFlowMode === b.VerticalFlowMode) && (this.TemperatureScale === b.TemperatureScale) && (this.Quiet === b.Quiet) && (this.Display === b.Display) && (this.Health === b.Health) && (this.Drying === b.Drying) && (this.Sleep === b.Sleep) && (this.Eco === b.Eco);
    };
    this.$assign = function (s) {
      this.Power = s.Power;
      this.Mode = s.Mode;
      this.IndoorTemperature = s.IndoorTemperature;
      this.DesiredTemperature = s.DesiredTemperature;
      this.Turbo = s.Turbo;
      this.FanSpeed = s.FanSpeed;
      this.HorizontalFlowMode = s.HorizontalFlowMode;
      this.VerticalFlowMode = s.VerticalFlowMode;
      this.TemperatureScale = s.TemperatureScale;
      this.Quiet = s.Quiet;
      this.Display = s.Display;
      this.Health = s.Health;
      this.Drying = s.Drying;
      this.Sleep = s.Sleep;
      this.Eco = s.Eco;
      return this;
    };
  });
});
rtl.module("Hvac.Models.Dto",["System","Hvac.Models.Core","Hvac.Models.Domain"],function () {
  "use strict";
  var $mod = this;
  rtl.recNewT(this,"THvacStateDto",function () {
    this.Power = false;
    this.Mode = 0;
    this.IndoorTemperature = 0.0;
    this.DesiredTemperature = 0;
    this.Turbo = false;
    this.FanSpeed = 0;
    this.HorizontalFlowMode = 0;
    this.VerticalFlowMode = 0;
    this.TemperatureScale = 0;
    this.Quiet = false;
    this.Display = false;
    this.Health = false;
    this.Drying = false;
    this.Sleep = false;
    this.Eco = false;
    this.$eq = function (b) {
      return (this.Power === b.Power) && (this.Mode === b.Mode) && (this.IndoorTemperature === b.IndoorTemperature) && (this.DesiredTemperature === b.DesiredTemperature) && (this.Turbo === b.Turbo) && (this.FanSpeed === b.FanSpeed) && (this.HorizontalFlowMode === b.HorizontalFlowMode) && (this.VerticalFlowMode === b.VerticalFlowMode) && (this.TemperatureScale === b.TemperatureScale) && (this.Quiet === b.Quiet) && (this.Display === b.Display) && (this.Health === b.Health) && (this.Drying === b.Drying) && (this.Sleep === b.Sleep) && (this.Eco === b.Eco);
    };
    this.$assign = function (s) {
      this.Power = s.Power;
      this.Mode = s.Mode;
      this.IndoorTemperature = s.IndoorTemperature;
      this.DesiredTemperature = s.DesiredTemperature;
      this.Turbo = s.Turbo;
      this.FanSpeed = s.FanSpeed;
      this.HorizontalFlowMode = s.HorizontalFlowMode;
      this.VerticalFlowMode = s.VerticalFlowMode;
      this.TemperatureScale = s.TemperatureScale;
      this.Quiet = s.Quiet;
      this.Display = s.Display;
      this.Health = s.Health;
      this.Drying = s.Drying;
      this.Sleep = s.Sleep;
      this.Eco = s.Eco;
      return this;
    };
    this.ToJson = function (pretty) {
      var Result = "";
      var json = null;
      json = pas.fpjson.TJSONObject.$create("Create$2");
      try {
        json.SetBooleans("power",this.Power);
        json.SetStrings("mode",pas.TypInfo.GetEnumName(pas["Hvac.Models.Core"].$rtti["THvacMode"],this.Mode));
        json.SetFloats("indoorTemperature",this.IndoorTemperature);
        json.SetIntegers("desiredTemperature",this.DesiredTemperature);
        json.SetBooleans("turbo",this.Turbo);
        json.SetStrings("fanSpeed",pas.TypInfo.GetEnumName(pas["Hvac.Models.Core"].$rtti["TFanSpeed"],this.FanSpeed));
        json.SetStrings("horizontalFlowMode",pas.TypInfo.GetEnumName(pas["Hvac.Models.Core"].$rtti["THorizontalFlowMode"],this.HorizontalFlowMode));
        json.SetStrings("verticalFlowMode",pas.TypInfo.GetEnumName(pas["Hvac.Models.Core"].$rtti["TVerticalFlowMode"],this.VerticalFlowMode));
        json.SetStrings("temperatureScale",pas.TypInfo.GetEnumName(pas["Hvac.Models.Core"].$rtti["TTemperatureScale"],this.TemperatureScale));
        json.SetBooleans("quiet",this.Quiet);
        json.SetBooleans("display",this.Display);
        json.SetBooleans("health",this.Health);
        json.SetBooleans("drying",this.Drying);
        json.SetBooleans("sleep",this.Sleep);
        json.SetBooleans("eco",this.Eco);
        json.$class.SetCompressedJSON(true);
        if (pretty) {
          Result = json.FormatJSON(pas.fpjson.DefaultFormat,2)}
         else Result = json.GetAsJSON();
      } finally {
        json = rtl.freeLoc(json);
      };
      return Result;
    };
    this.ToHvacState = function () {
      var Result = pas["Hvac.Models.Domain"].THvacState.$new();
      Result.Power = this.Power;
      Result.Mode = this.Mode;
      Result.DesiredTemperature = this.DesiredTemperature;
      Result.IndoorTemperature = this.IndoorTemperature;
      Result.Turbo = this.Turbo;
      Result.FanSpeed = this.FanSpeed;
      Result.HorizontalFlowMode = this.HorizontalFlowMode;
      Result.VerticalFlowMode = this.VerticalFlowMode;
      Result.TemperatureScale = this.TemperatureScale;
      Result.Quiet = this.Quiet;
      Result.Display = this.Display;
      Result.Health = this.Health;
      Result.Drying = this.Drying;
      Result.Sleep = this.Sleep;
      Result.Eco = this.Eco;
      return Result;
    };
    this.FromJson = function (content) {
      var json = null;
      json = pas.fpjson.GetJSON(content,true);
      try {
        this.Power = json.GetPath("power").GetAsBoolean();
        this.Mode = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["THvacMode"],json.GetPath("mode").GetAsString());
        this.DesiredTemperature = json.GetPath("desiredTemperature").GetAsInteger();
        this.IndoorTemperature = json.GetPath("indoorTemperature").GetAsFloat();
        this.Turbo = json.GetPath("turbo").GetAsBoolean();
        this.FanSpeed = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["TFanSpeed"],json.GetPath("fanSpeed").GetAsString());
        this.HorizontalFlowMode = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["THorizontalFlowMode"],json.GetPath("horizontalFlowMode").GetAsString());
        this.VerticalFlowMode = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["TVerticalFlowMode"],json.GetPath("verticalFlowMode").GetAsString());
        this.TemperatureScale = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["TTemperatureScale"],json.GetPath("temperatureScale").GetAsString());
        this.Quiet = json.GetPath("quiet").GetAsBoolean();
        this.Display = json.GetPath("display").GetAsBoolean();
        this.Health = json.GetPath("health").GetAsBoolean();
        this.Drying = json.GetPath("drying").GetAsBoolean();
        this.Sleep = json.GetPath("sleep").GetAsBoolean();
        this.Eco = json.GetPath("eco").GetAsBoolean();
      } finally {
        json = rtl.freeLoc(json);
      };
      return this;
    };
    this.FromHvacState = function (state) {
      this.Power = state.Power;
      this.Mode = state.Mode;
      this.IndoorTemperature = state.IndoorTemperature;
      this.DesiredTemperature = state.DesiredTemperature;
      this.Turbo = state.Turbo;
      this.FanSpeed = state.FanSpeed;
      this.HorizontalFlowMode = state.HorizontalFlowMode;
      this.VerticalFlowMode = state.VerticalFlowMode;
      this.TemperatureScale = state.TemperatureScale;
      this.Quiet = state.Quiet;
      this.Display = state.Display;
      this.Health = state.Health;
      this.Drying = state.Drying;
      this.Sleep = state.Sleep;
      this.Eco = state.Eco;
      return this;
    };
  });
},["fpjson","TypInfo"]);
rtl.module("Hvac.Web.Core",["System"],function () {
  "use strict";
  var $mod = this;
  this.TUITabIndex = {"0": "tabControls", tabControls: 0, "1": "tabSettings", tabSettings: 1, "2": "tabAbout", tabAbout: 2};
  rtl.recNewT(this,"TSettings",function () {
    this.ApiUrl = "";
    this.ApiKey = "";
    this.$eq = function (b) {
      return (this.ApiUrl === b.ApiUrl) && (this.ApiKey === b.ApiKey);
    };
    this.$assign = function (s) {
      this.ApiUrl = s.ApiUrl;
      this.ApiKey = s.ApiKey;
      return this;
    };
  });
  rtl.recNewT(this,"TOption",function () {
    this.Value = "";
    this.Text = "";
    this.$eq = function (b) {
      return (this.Value === b.Value) && (this.Text === b.Text);
    };
    this.$assign = function (s) {
      this.Value = s.Value;
      this.Text = s.Text;
      return this;
    };
    this.Create = function (AValue, AText) {
      this.Value = AValue;
      this.Text = AText;
      return this;
    };
  });
});
rtl.module("Hvac.Web.Components.UIComponent",["System","Web"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TUIComponent",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FContainer = null;
    };
    this.$final = function () {
      this.FContainer = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (AContainer) {
      this.FContainer = AContainer;
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
  });
  rtl.createClass(this,"TThemeSwitcher",pas["Hvac.Web.Components.UIComponent"].TUIComponent,function () {
    this.$init = function () {
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$init.call(this);
      this.FSwitcherElement = null;
      this.FTheme = $mod.TUITheme.$new();
      this.FThemes = [];
      this.FTargetElement = null;
      this.FItemTemplate = null;
      this.FStorage = null;
    };
    this.$final = function () {
      this.FSwitcherElement = undefined;
      this.FTheme = undefined;
      this.FThemes = undefined;
      this.FTargetElement = undefined;
      this.FItemTemplate = undefined;
      this.FStorage = undefined;
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$final.call(this);
    };
    this.ChangeTheme = function (AIndex) {
      var item = null;
      if ((AIndex < 0) || (AIndex > (rtl.length(this.FThemes) - 1))) return;
      this.FTheme.$assign(this.FThemes[AIndex]);
      this.FTargetElement.className = this.FTheme.ClassName;
      item = this.FSwitcherElement.querySelector(".is-active");
      if (item != null) item.classList.remove("is-active");
      this.FSwitcherElement.querySelector(pas.SysUtils.Format("ul li:nth-child(%d)",pas.System.VarRecs(0,AIndex + 1))).classList.add("is-active");
    };
    this.AddTheme = function (ATheme) {
      var $Self = this;
      var item = null;
      var link = null;
      this.FThemes = rtl.arraySetLength(this.FThemes,$mod.TUITheme,rtl.length(this.FThemes) + 1);
      this.FThemes[rtl.length(this.FThemes) - 1].$assign(ATheme);
      item = this.FItemTemplate.content.cloneNode(true).childNodes.item(1);
      item.querySelector("span").innerText = ATheme.Title;
      link = item.querySelector("a");
      link.setAttribute("data-theme-index",pas.SysUtils.IntToStr(rtl.length(this.FThemes) - 1));
      link.onclick = function (AEvent) {
        var Result = false;
        var themeIndex = 0;
        themeIndex = pas.SysUtils.StrToInt(AEvent.currentTarget.getAttribute("data-theme-index"));
        $Self.ChangeTheme(themeIndex);
        if ($Self.FStorage != null) $Self.FStorage.setItem("Theme",$Self.FThemes[themeIndex].ClassName);
        Result = true;
        return Result;
      };
      this.FSwitcherElement.querySelector("ul").appendChild(item);
      if ((this.FStorage != null) && (this.FStorage.getItem("Theme") === ATheme.ClassName)) {
        this.ChangeTheme(rtl.length(this.FThemes) - 1)}
       else if (rtl.length(this.FThemes) === 1) this.ChangeTheme(0);
    };
    this.AddTheme$1 = function (ATitle, AClassName) {
      var theme = $mod.TUITheme.$new();
      theme.Title = ATitle;
      theme.ClassName = AClassName;
      this.AddTheme($mod.TUITheme.$clone(theme));
    };
    this.Create$2 = function (AContainer, ATargetElement, ATemplate, AItemTemplate, AStorage) {
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.Create$1.call(this,AContainer);
      this.FStorage = AStorage;
      this.FTargetElement = ATargetElement;
      this.FItemTemplate = AItemTemplate;
      this.FSwitcherElement = ATemplate.content.cloneNode(true).childNodes.item(1);
      AContainer.appendChild(this.FSwitcherElement);
      return this;
    };
  });
},["SysUtils"]);
rtl.module("Hvac.Web.Components.SettingsForm",["System","Web","Hvac.Web.Core","Hvac.Web.Components.UIComponent","Hvac.Web.Components.ThemeSwitcher"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TSettingsForm",pas["Hvac.Web.Components.UIComponent"].TUIComponent,function () {
    this.$init = function () {
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$init.call(this);
      this.FElement = null;
      this.FApiUrlInput = null;
      this.FApiKeyInput = null;
      this.FSaveButton = null;
      this.FStorage = null;
      this.FThemeSwitcher = null;
      this.FOnSave = null;
    };
    this.$final = function () {
      this.FElement = undefined;
      this.FApiUrlInput = undefined;
      this.FApiKeyInput = undefined;
      this.FSaveButton = undefined;
      this.FStorage = undefined;
      this.FThemeSwitcher = undefined;
      this.FOnSave = undefined;
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$final.call(this);
    };
    this.GetSettings = function () {
      var Result = pas["Hvac.Web.Core"].TSettings.$new();
      Result.ApiUrl = this.FApiUrlInput.value;
      Result.ApiKey = this.FApiKeyInput.value;
      return Result;
    };
    this.Create$2 = function (AContainer, ATemplate, AStorage) {
      var $Self = this;
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.Create$1.call(this,AContainer);
      this.FStorage = AStorage;
      this.FElement = ATemplate.content.cloneNode(true).childNodes.item(1);
      this.FApiUrlInput = this.FElement.querySelector(".input-api-url");
      this.FApiKeyInput = this.FElement.querySelector(".input-api-key");
      this.FSaveButton = this.FElement.querySelector(".button-api-save");
      this.FThemeSwitcher = pas["Hvac.Web.Components.ThemeSwitcher"].TThemeSwitcher.$create("Create$2",[this.FElement.querySelector(".theme-switcher"),document.querySelector("html"),document.getElementById("themeSwitcherTemplate"),document.getElementById("themeSwitcherItemTemplate"),window.localStorage]);
      AContainer.appendChild(this.FElement);
      if (this.FStorage != null) {
        this.FApiUrlInput.value = this.FStorage.getItem("ApiUrl");
        this.FApiKeyInput.value = this.FStorage.getItem("ApiKey");
      };
      this.FSaveButton.onclick = function (AEvent) {
        var Result = false;
        if ($Self.FStorage != null) {
          $Self.FStorage.setItem("ApiUrl",$Self.FApiUrlInput.value);
          $Self.FStorage.setItem("ApiKey",$Self.FApiKeyInput.value);
        };
        if ($Self.FOnSave != null) $Self.FOnSave(new Event("save"));
        return Result;
      };
      return this;
    };
  });
});
rtl.module("Hvac.Web.Components.Tabs",["System","Web","Hvac.Web.Components.UIComponent"],function () {
  "use strict";
  var $mod = this;
  rtl.recNewT(this,"TTab",function () {
    this.Title = "";
    this.Element = null;
    this.$eq = function (b) {
      return (this.Title === b.Title) && (this.Element === b.Element);
    };
    this.$assign = function (s) {
      this.Title = s.Title;
      this.Element = s.Element;
      return this;
    };
  });
  rtl.createClass(this,"TTabs",pas["Hvac.Web.Components.UIComponent"].TUIComponent,function () {
    this.$init = function () {
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$init.call(this);
      this.FTabs = [];
      this.FTab = $mod.TTab.$new();
      this.FTemplate = null;
      this.FItemTemplate = null;
      this.FTabsElement = null;
    };
    this.$final = function () {
      this.FTabs = undefined;
      this.FTab = undefined;
      this.FTemplate = undefined;
      this.FItemTemplate = undefined;
      this.FTabsElement = undefined;
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.$final.call(this);
    };
    this.Create$2 = function (AContainer, ATemplate, AItemTemplate) {
      pas["Hvac.Web.Components.UIComponent"].TUIComponent.Create$1.call(this,AContainer);
      this.FTemplate = ATemplate;
      this.FItemTemplate = AItemTemplate;
      this.FTabsElement = this.FTemplate.content.cloneNode(true).childNodes.item(1);
      AContainer.appendChild(this.FTabsElement);
      return this;
    };
    this.ChangeTab = function (AIndex) {
      var item = null;
      if ((AIndex < 0) || (AIndex > (rtl.length(this.FTabs) - 1))) return;
      if (this.FTab.Element != null) this.FTab.Element.classList.add("is-hidden");
      this.FTab.$assign(this.FTabs[AIndex]);
      this.FTab.Element.classList.remove("is-hidden");
      item = this.FTabsElement.querySelector(".is-active");
      if (item != null) item.classList.remove("is-active");
      this.FTabsElement.querySelector(pas.SysUtils.Format("ul li:nth-child(%d)",pas.System.VarRecs(0,AIndex + 1))).classList.add("is-active");
    };
    this.AddTab = function (ATitle, AElement) {
      var tab = $mod.TTab.$new();
      tab.Title = ATitle;
      tab.Element = AElement;
      this.AddTab$1(tab);
    };
    this.AddTab$1 = function (ATab) {
      var $Self = this;
      var item = null;
      var link = null;
      this.FTabs = rtl.arraySetLength(this.FTabs,$mod.TTab,rtl.length(this.FTabs) + 1);
      this.FTabs[rtl.length(this.FTabs) - 1].$assign(ATab);
      item = this.FItemTemplate.content.cloneNode(true).childNodes.item(1);
      item.querySelector("span").innerText = ATab.Title;
      link = item.querySelector("a");
      link.setAttribute("data-tab-index",pas.SysUtils.IntToStr(rtl.length(this.FTabs) - 1));
      link.onclick = function (AEvent) {
        var Result = false;
        var tabIndex = 0;
        tabIndex = pas.SysUtils.StrToInt(AEvent.currentTarget.getAttribute("data-tab-index"));
        $Self.ChangeTab(tabIndex);
        Result = true;
        return Result;
      };
      this.FTabsElement.querySelector("ul").appendChild(item);
      if (rtl.length(this.FTabs) === 1) this.ChangeTab(0);
    };
  });
},["SysUtils"]);
rtl.module("strutils",["System","SysUtils","Types"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.IfThen = function (AValue, ATrue, AFalse) {
    var Result = "";
    if (AValue) {
      Result = ATrue}
     else Result = AFalse;
    return Result;
  };
  this.Soundex = function (AText, ALength) {
    var Result = "";
    var S = "\x00";
    var PS = "\x00";
    var I = 0;
    var L = 0;
    Result = "";
    PS = "\x00";
    if (AText.length > 0) {
      Result = pas.System.upcase(AText.charAt(0));
      I = 2;
      L = AText.length;
      while ((I <= L) && (Result.length < ALength)) {
        S = $impl.SScore.charAt(AText.charCodeAt(I - 1) - 1);
        if (!(S.charCodeAt() in rtl.createSet(48,105,PS.charCodeAt()))) Result = Result + S;
        if (S !== "i") PS = S;
        I += 1;
      };
    };
    L = Result.length;
    if (L < ALength) Result = Result + pas.System.StringOfChar("0",ALength - L);
    return Result;
  };
  this.SoundexSimilar = function (AText, AOther, ALength) {
    var Result = false;
    Result = $mod.Soundex(AText,ALength) === $mod.Soundex(AOther,ALength);
    return Result;
  };
  this.SoundexSimilar$1 = function (AText, AOther) {
    var Result = false;
    Result = $mod.SoundexSimilar(AText,AOther,4);
    return Result;
  };
  this.SoundexProc = function (AText, AOther) {
    var Result = false;
    Result = $mod.SoundexSimilar$1(AText,AOther);
    return Result;
  };
  this.AnsiResemblesProc = null;
  this.ResemblesProc = null;
  $mod.$implcode = function () {
    $impl.SScore = "00000000000000000000000000000000" + "00000000000000000000000000000000" + "0123012i02245501262301i2i2" + "000000" + "0123012i02245501262301i2i2" + "00000000000000000000000000000000" + "00000000000000000000000000000000" + "00000000000000000000000000000000" + "00000000000000000000000000000000" + "00000";
  };
  $mod.$init = function () {
    $mod.AnsiResemblesProc = $mod.SoundexProc;
    $mod.ResemblesProc = $mod.SoundexProc;
  };
},["JS"]);
rtl.module("Hvac.Web.UI",["System","Classes","Web","Hvac.Models.Core","Hvac.Models.Domain","Hvac.Web.Core","Hvac.Web.Components.SettingsForm","Hvac.Web.Components.Tabs"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TUIState",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FPower = false;
      this.FTabs = null;
      this.FDocument = null;
      this.FSettingsForm = null;
      this.FPowerButton = null;
      this.FSettingsSection = null;
      this.FMainSection = null;
      this.FAboutSection = null;
      this.FErrorSection = null;
      this.FControls = null;
      this.FIndoorTemperature = null;
      this.FDesiredTemperature = null;
      this.FMode = null;
      this.FTemperatureScale = null;
      this.FFanSpeed = null;
      this.FHorizontalFlow = null;
      this.FVerticalFlow = null;
      this.FTurbo = null;
      this.FQuiet = null;
      this.FDisplay = null;
      this.FHealth = null;
      this.FDrying = null;
      this.FSleep = null;
      this.FEco = null;
      this.FReloadButton = null;
      this.FPorgressBar = null;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FTabs = undefined;
      this.FDocument = undefined;
      this.FSettingsForm = undefined;
      this.FPowerButton = undefined;
      this.FSettingsSection = undefined;
      this.FMainSection = undefined;
      this.FAboutSection = undefined;
      this.FErrorSection = undefined;
      this.FControls = undefined;
      this.FIndoorTemperature = undefined;
      this.FDesiredTemperature = undefined;
      this.FMode = undefined;
      this.FTemperatureScale = undefined;
      this.FFanSpeed = undefined;
      this.FHorizontalFlow = undefined;
      this.FVerticalFlow = undefined;
      this.FTurbo = undefined;
      this.FQuiet = undefined;
      this.FDisplay = undefined;
      this.FHealth = undefined;
      this.FDrying = undefined;
      this.FSleep = undefined;
      this.FEco = undefined;
      this.FReloadButton = undefined;
      this.FPorgressBar = undefined;
      this.FOnChange = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.BindControls = function () {
      this.FSettingsSection = this.FDocument.getElementById("settingsSection");
      this.FMainSection = this.FDocument.getElementById("mainSection");
      this.FAboutSection = this.FDocument.getElementById("aboutSection");
      this.FErrorSection = this.FDocument.getElementById("errorSection");
      this.FControls = this.FDocument.getElementById("controls");
      this.FPorgressBar = this.FDocument.getElementById("progressBar");
      this.FReloadButton = this.FDocument.getElementById("btnReload");
      this.FPowerButton = this.FDocument.getElementById("btnPower");
      this.FSettingsForm = pas["Hvac.Web.Components.SettingsForm"].TSettingsForm.$create("Create$2",[this.FSettingsSection,this.FDocument.getElementById("settingsFormTemplate"),window.localStorage]);
      this.FIndoorTemperature = this.FDocument.getElementById("indoorTemperature");
      this.FMode = this.FDocument.getElementById("mode");
      this.FTemperatureScale = this.FDocument.getElementById("temperatureScale");
      this.FFanSpeed = this.FDocument.getElementById("fanSpeed");
      this.FHorizontalFlow = this.FDocument.getElementById("horizontalFlow");
      this.FVerticalFlow = this.FDocument.getElementById("verticalFlow");
      this.FDesiredTemperature = this.FDocument.getElementById("desiredTemperature");
      this.FTurbo = this.FDocument.getElementById("turbo");
      this.FQuiet = this.FDocument.getElementById("quiet");
      this.FDisplay = this.FDocument.getElementById("display");
      this.FHealth = this.FDocument.getElementById("health");
      this.FDrying = this.FDocument.getElementById("drying");
      this.FSleep = this.FDocument.getElementById("sleep");
      this.FEco = this.FDocument.getElementById("eco");
      this.FTabs = pas["Hvac.Web.Components.Tabs"].TTabs.$create("Create$2",[this.FDocument.getElementById("tabs"),this.FDocument.getElementById("tabsTemplate"),this.FDocument.getElementById("tabItemTemplate")]);
    };
    this.InitControls = function () {
      var $Self = this;
      function PopulateSelect(ASelect, AOptions) {
        var optionElement = null;
        var item = pas["Hvac.Web.Core"].TOption.$new();
        ASelect.innerHTML = pas.SysUtils.TStringHelper.Empty;
        for (var $in = AOptions, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
          item = $in[$l];
          optionElement = $Self.FDocument.createElement("option");
          optionElement.value = item.Value;
          optionElement.text = item.Text;
          ASelect.appendChild(optionElement);
        };
      };
      this.FTabs.AddTab("Controls",this.FMainSection);
      this.FTabs.AddTab("Settings",this.FSettingsSection);
      this.FTabs.AddTab("About",this.FAboutSection);
      PopulateSelect(this.FMode,[pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THvacMode[pas["Hvac.Models.Core"].THvacMode.mdAuto],"Auto"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THvacMode[pas["Hvac.Models.Core"].THvacMode.mdCool],"Cool"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THvacMode[pas["Hvac.Models.Core"].THvacMode.mdDry],"Dry"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THvacMode[pas["Hvac.Models.Core"].THvacMode.mdFan],"Fan"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THvacMode[pas["Hvac.Models.Core"].THvacMode.mdHeat],"Heat")]);
      PopulateSelect(this.FTemperatureScale,[pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TTemperatureScale[pas["Hvac.Models.Core"].TTemperatureScale.tsCelsius],"°C"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TTemperatureScale[pas["Hvac.Models.Core"].TTemperatureScale.tsFahrenheit],"°F")]);
      PopulateSelect(this.FFanSpeed,[pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TFanSpeed[pas["Hvac.Models.Core"].TFanSpeed.fsAuto],"Auto"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TFanSpeed[pas["Hvac.Models.Core"].TFanSpeed.fsLevel1],"Level 1"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TFanSpeed[pas["Hvac.Models.Core"].TFanSpeed.fsLevel2],"Level 2"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TFanSpeed[pas["Hvac.Models.Core"].TFanSpeed.fsLevel3],"Level 3"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TFanSpeed[pas["Hvac.Models.Core"].TFanSpeed.fsLevel4],"Level 4"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TFanSpeed[pas["Hvac.Models.Core"].TFanSpeed.fsLevel5],"Level 5"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TFanSpeed[pas["Hvac.Models.Core"].TFanSpeed.fsLevel6],"Level 6")]);
      PopulateSelect(this.FHorizontalFlow,[pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmStop],"Stop"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmSwing],"Swing"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmLeft],"Left"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmLeftCenter],"Left / Center"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmCenter],"Center"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmRightCenter],"Right / Center"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmRight],"Right"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmLeftRight],"Left / Right"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].THorizontalFlowMode[pas["Hvac.Models.Core"].THorizontalFlowMode.hfmSwingWide],"Swing / Wide")]);
      PopulateSelect(this.FVerticalFlow,[pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TVerticalFlowMode[pas["Hvac.Models.Core"].TVerticalFlowMode.vfmStop],"Stop"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TVerticalFlowMode[pas["Hvac.Models.Core"].TVerticalFlowMode.vfmSwing],"Swing"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TVerticalFlowMode[pas["Hvac.Models.Core"].TVerticalFlowMode.vfmTop],"Top"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TVerticalFlowMode[pas["Hvac.Models.Core"].TVerticalFlowMode.vfmTopCenter],"Top / Center"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TVerticalFlowMode[pas["Hvac.Models.Core"].TVerticalFlowMode.vfmCenter],"Center"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TVerticalFlowMode[pas["Hvac.Models.Core"].TVerticalFlowMode.vfmBottomCenter],"Bottom / Center"),pas["Hvac.Web.Core"].TOption.$new().Create(pas["Hvac.Models.Core"].TVerticalFlowMode[pas["Hvac.Models.Core"].TVerticalFlowMode.vfmBottom],"Bottom")]);
    };
    this.HookControlEventListeners = function () {
      var $Self = this;
      this.FControls.querySelectorAll("input, select").forEach(function (ANode, AIndex, ANodeList) {
        if (rtl.isExt(ANode,Element)) ANode.addEventListener("change",rtl.createSafeCallback($Self,"OnStateChange"));
      });
      this.FPowerButton.addEventListener("click",function (AEvent) {
        var Result = false;
        $Self.FPower = !$Self.FPower;
        $Self.UpdatePowerButton();
        $Self.OnStateChange(AEvent);
        return Result;
      });
    };
    var CssClass = "is-link";
    this.UpdatePowerButton = function () {
      if (this.FPower) {
        this.FPowerButton.classList.add(CssClass)}
       else this.FPowerButton.classList.remove(CssClass);
    };
    this.OnStateChange = function (AEvent) {
      var Result = false;
      if (this.FOnChange != null) this.FOnChange(AEvent);
      Result = true;
      return Result;
    };
    this.ChangeTab = function (ATabIndex) {
      this.FTabs.ChangeTab(ATabIndex);
    };
    this.SetState = function (AState) {
      this.FPower = AState.Power;
      this.UpdatePowerButton();
      this.FIndoorTemperature.innerText = pas.SysUtils.Format("%.1f %s",pas.System.VarRecs(3,AState.IndoorTemperature,18,pas.strutils.IfThen(AState.TemperatureScale === pas["Hvac.Models.Core"].TTemperatureScale.tsCelsius,"°C","°F")));
      this.FDesiredTemperature.value = "" + AState.DesiredTemperature;
      this.FMode.value = pas["Hvac.Models.Core"].THvacMode[AState.Mode];
      this.FTemperatureScale.value = pas["Hvac.Models.Core"].TTemperatureScale[AState.TemperatureScale];
      this.FFanSpeed.value = pas["Hvac.Models.Core"].TFanSpeed[AState.FanSpeed];
      this.FHorizontalFlow.value = pas["Hvac.Models.Core"].THorizontalFlowMode[AState.HorizontalFlowMode];
      this.FVerticalFlow.value = pas["Hvac.Models.Core"].TVerticalFlowMode[AState.VerticalFlowMode];
      this.FTurbo.checked = AState.Turbo;
      this.FQuiet.checked = AState.Quiet;
      this.FDisplay.checked = AState.Display;
      this.FHealth.checked = AState.Health;
      this.FDrying.checked = AState.Drying;
      this.FSleep.checked = AState.Sleep;
      this.FEco.checked = AState.Eco;
    };
    this.GetState = function () {
      var Result = pas["Hvac.Models.Domain"].THvacState.$new();
      Result.Power = this.FPower;
      Result.DesiredTemperature = pas.SysUtils.StrToInt(this.FDesiredTemperature.value);
      Result.Mode = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["THvacMode"],this.FMode.value);
      Result.TemperatureScale = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["TTemperatureScale"],this.FTemperatureScale.value);
      Result.FanSpeed = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["TFanSpeed"],this.FFanSpeed.value);
      Result.HorizontalFlowMode = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["THorizontalFlowMode"],this.FHorizontalFlow.value);
      Result.VerticalFlowMode = pas.TypInfo.GetEnumValue(pas["Hvac.Models.Core"].$rtti["TVerticalFlowMode"],this.FVerticalFlow.value);
      Result.Turbo = this.FTurbo.checked;
      Result.Quiet = this.FQuiet.checked;
      Result.Display = this.FDisplay.checked;
      Result.Health = this.FHealth.checked;
      Result.Drying = this.FDrying.checked;
      Result.Sleep = this.FSleep.checked;
      Result.Eco = this.FEco.checked;
      return Result;
    };
    this.EnableControls = function () {
      var $Self = this;
      this.FControls.querySelectorAll("input, select, button").forEach(function (ANode, AIndex, ANodeList) {
        if (rtl.isExt(ANode,Element)) ANode.removeAttribute("disabled");
      });
    };
    this.DisableControls = function () {
      var $Self = this;
      this.FControls.querySelectorAll("input, select, button").forEach(function (ANode, AIndex, ANodeList) {
        if (rtl.isExt(ANode,Element)) ANode.setAttribute("disabled","true");
      });
      this.FIndoorTemperature.innerText = "--";
    };
    this.ShowProgressBar = function () {
      this.FPorgressBar.classList.remove("is-hidden");
    };
    this.HideProgressBar = function () {
      this.FPorgressBar.classList.add("is-hidden");
    };
    this.ShowErrorMessage = function (AError) {
      this.FErrorSection.querySelector(".message-body").innerText = AError;
      this.FErrorSection.classList.remove("is-hidden");
    };
    this.HideErrorMessage = function () {
      this.FErrorSection.querySelector(".message-body").innerText = pas.SysUtils.TStringHelper.Empty;
      this.FErrorSection.classList.add("is-hidden");
    };
    this.Create$1 = function (ADocument) {
      this.FDocument = ADocument;
      this.BindControls();
      this.InitControls();
      this.HookControlEventListeners();
      return this;
    };
  });
},["SysUtils","strutils","TypInfo"]);
rtl.module("program",["System","JS","fpjson","fpjsonjs","SysUtils","Web","Hvac.Models.Domain","Hvac.Models.Dto","Hvac.Web.Core","Hvac.Web.UI"],function () {
  "use strict";
  var $mod = this;
  this.Settings = pas["Hvac.Web.Core"].TSettings.$new();
  this.UI = null;
  this.OnError = function (AData) {
    var msg = "";
    if (rtl.isExt(AData,Response,1)) {
      msg = AData.statusText}
     else if (rtl.isExt(AData,Error,1)) {
      msg = AData.message}
     else msg = "Unknown error";
    $mod.UI.ShowErrorMessage(msg);
    $mod.UI.HideProgressBar();
    $mod.UI.EnableControls();
  };
  this.OnStateLoaded = async function (AResponse) {
    var state = pas["Hvac.Models.Domain"].THvacState.$new();
    if (!AResponse.ok) {
      $mod.OnError(AResponse);
      return;
    };
    state.$assign(pas["Hvac.Models.Dto"].THvacStateDto.$new().FromJson(await AResponse.text()).ToHvacState());
    $mod.UI.SetState(pas["Hvac.Models.Domain"].THvacState.$clone(state));
    $mod.UI.EnableControls();
    $mod.UI.HideProgressBar();
  };
  var endpoint = "state";
  this.LoadState = function () {
    var options = null;
    $mod.UI.DisableControls();
    $mod.UI.ShowProgressBar();
    $mod.UI.HideErrorMessage();
    options = pas.JS.New(["headers",pas.JS.New(["X-Api-Key",$mod.Settings.ApiKey])]);
    window.fetch(pas.SysUtils.Format("%s/%s",pas.System.VarRecs(18,$mod.Settings.ApiUrl,18,endpoint)),options).then(function (response) {
      var Result = undefined;
      $mod.OnStateLoaded(response);
      return Result;
    },function (response) {
      var Result = undefined;
      $mod.OnError(response);
      return Result;
    }).catch(function (response) {
      var Result = undefined;
      $mod.OnError(response);
      return Result;
    });
  };
  var endpoint$1 = "state";
  this.SaveState = function () {
    var state = pas["Hvac.Models.Domain"].THvacState.$new();
    var options = null;
    $mod.UI.ShowProgressBar();
    $mod.UI.DisableControls();
    $mod.UI.HideErrorMessage();
    state.$assign($mod.UI.GetState());
    options = pas.JS.New(["method","PUT","headers",pas.JS.New(["X-Api-Key",$mod.Settings.ApiKey,"Content-Type","application/json"]),"body",pas["Hvac.Models.Dto"].THvacStateDto.$new().FromHvacState(pas["Hvac.Models.Domain"].THvacState.$clone(state)).ToJson(false)]);
    window.fetch(pas.SysUtils.Format("%s/%s",pas.System.VarRecs(18,$mod.Settings.ApiUrl,18,endpoint$1)),options).then(function (response) {
      var Result = undefined;
      $mod.OnStateLoaded(response);
      return Result;
    },function (response) {
      var Result = undefined;
      $mod.OnError(response);
      return Result;
    }).catch(function (response) {
      var Result = undefined;
      $mod.OnError(response);
      return Result;
    });
  };
  this.OnStateChange = function (AEvent) {
    var Result = false;
    $mod.SaveState();
    Result = true;
    return Result;
  };
  $mod.$main = function () {
    $mod.UI = pas["Hvac.Web.UI"].TUIState.$create("Create$1",[document]);
    $mod.UI.FSettingsForm.FThemeSwitcher.AddTheme$1("☀️","theme-light");
    $mod.UI.FSettingsForm.FThemeSwitcher.AddTheme$1("🌙","theme-dark");
    $mod.UI.FReloadButton.addEventListener("click",$mod.LoadState);
    $mod.UI.FOnChange = rtl.createSafeCallback($mod,"OnStateChange");
    $mod.UI.FSettingsForm.FOnSave = function (AEvent) {
      var Result = false;
      $mod.Settings.$assign($mod.UI.FSettingsForm.GetSettings());
      $mod.UI.ChangeTab(pas["Hvac.Web.Core"].TUITabIndex.tabControls);
      $mod.LoadState();
      return Result;
    };
    $mod.Settings.$assign($mod.UI.FSettingsForm.GetSettings());
    if (pas.System.Assigned($mod.Settings.ApiUrl) && !pas.SysUtils.TStringHelper.IsNullOrWhiteSpace($mod.Settings.ApiUrl)) {
      $mod.LoadState()}
     else $mod.UI.ChangeTab(pas["Hvac.Web.Core"].TUITabIndex.tabSettings);
  };
});
