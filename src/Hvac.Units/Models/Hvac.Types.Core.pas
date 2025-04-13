unit Hvac.Types.Core;

{$mode objfpc}

interface

type 
  THvacMode =  (
    mdAuto,
    mdCool,
    mdDry,
    mdFan,
    mdHeat
  );

  TFanSpeed = (
    fsAuto,
    fsLevel1,
    fsLevel2,
    fsLevel3,
    fsLevel4,
    fsLevel5,
    fsLevel6
  );

  THorizontalFlowMode = (
    hfmStop,
    hfmSwing,
    hfmLeft,
    hfmLeftCenter,
    hfmCenter,
    hfmRightCenter,
    hfmRight,
    hfmLeftRight,
    hfmSwingWide
  );

  TVerticalFlowMode = (
    vfmStop,
    vfmSwing,
    vfmTop,
    vfmTopCenter,
    vfmCenter,
    vfmBottomCenter,
    vfmBottom
  );

  TTemperatureScale = (
    tsCelsius,
    tsFahrenheit
  );

implementation

end.
