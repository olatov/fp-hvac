unit Hvac.Utils.Temperature;

{$mode objfpc}

interface

function CelsiusToFahrenheit(temperature: double): double;
function FahrenheitToCelsius(temperature: double): double;

implementation

function CelsiusToFahrenheit(temperature: double): double;
begin
    result := (temperature * 1.8) + 32;
end;

function FahrenheitToCelsius(temperature: double): double;
begin
    result := (temperature - 32) / 1.8;
end;

end.