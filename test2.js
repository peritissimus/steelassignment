
const metal = {
    "mass": 150000,
    "density": 7000,
    "area": 4,
    "elements" : {
        "Fe":{
            "atMass": 56,
            "percentMass": 0.977,
            "k": 0.025
        },
        "Si":{
            "atMass": 28,
            "percentMass": 0.02,
            "k": 0.025
        },
        "O":{
            "atMass": 16,
            "percentMass": 0.003,
        }
    }
};

const slag = {
    "mass": 500,
    "density": 3500,
    "elements":{
        "FeO": {
            "atMass": 72,
            "percentMass": 0.5
        },
        "SiO2": {
            "atMass": 60,
            "percentMass": 0.5
        }
    }
};

const oxygenAdded = {
    "toprate": 200,
    "bottomrate": 0,
}

const thermo = {
    "initialtemperature":1800,
    "temprate": 0.2,
    "t": 0,
    "R": 8.314
}

const data = {
    metal,slag,oxygenAdded,thermo
}


// Steps Declaration



//repeat

const graphdata = (data, n) => {

    const metal = data.metal;
    const slag = data.slag;
    const oxygenAdded = data.oxygenAdded;
    const thermo = data.thermo;
        
    //VM =  molar volume
    metal.VM = [];
    slag.VM = [];
    // TM =  total moles
    metal.TM = [];
    slag.TM = [];
    // W = mass
    metal.W = [];
    slag.W = [];
    //V = volume
    metal.V = [];
    slag.V = [];

    // Km = Kilo moles
    metal.elements.Fe.KM = [];
    metal.elements.Si.KM = [];
    metal.elements.O.KM = [];
    slag.elements.FeO.KM = [];
    slag.elements.SiO2.KM = [];

    //bC = bulk concentration
    metal.elements.Fe.bC = [];
    metal.elements.Si.bC = [];
    metal.elements.O.bC = [];
    slag.elements.FeO.bC = [];
    slag.elements.SiO2.bC = [];

    //X is tthe mole fractions

    metal.elements.Fe.X = [];
    metal.elements.Si.X = [];
    metal.elements.O.X = [];
    slag.elements.FeO.X = [];
    slag.elements.SiO2.X = [];


    //perM = percent Mass
    metal.elements.Fe.perM = [];
    metal.elements.Si.perM = [];
    metal.elements.O.perM = [];
    slag.elements.FeO.perM = [];
    slag.elements.SiO2.perM = [];

    
    // Declaring initial variables

    metal.W[0] = metal.mass;
    slag.W[0] = slag.mass;

    metal.elements.Fe.perM[0] = metal.elements.Fe.percentMass;
    metal.elements.Si.perM[0] = metal.elements.Si.percentMass;
    metal.elements.O.perM[0] = metal.elements.O.percentMass;
    slag.elements.FeO.perM[0] = slag.elements.FeO.percentMass;
    slag.elements.SiO2.perM[0] = slag.elements.SiO2.percentMass;

    oxygenIn = ((oxygenAdded.toprate + oxygenAdded.bottomrate)/(22.4*60)) * (273/298) * 2;

    metal.elements.Fe.KM[0] =  ( metal.W[0] *  metal.elements.Fe.perM[0] )/metal.elements.Fe.atMass;
    metal.elements.Si.KM[0] =  ( metal.W[0] *  metal.elements.Si.perM[0] )/metal.elements.Si.atMass;
    metal.elements.O.KM[0] = ( metal.W[0] *  metal.elements.O.perM[0] )/metal.elements.O.atMass;
    slag.elements.FeO.KM[0] = ( slag.W[0] *  slag.elements.FeO.perM[0] )/slag.elements.FeO.atMass;
    slag.elements.SiO2.KM[0] = ( slag.W[0] *  slag.elements.SiO2.perM[0] )/slag.elements.SiO2.atMass;




        for (let i = 0; i<n; i++){


            metal.TM[i] = metal.W[i] * ((metal.elements.Fe.perM[i]/metal.elements.Fe.atMass) + (metal.elements.Si.perM[i]/metal.elements.Si.atMass) + (metal.elements.O.perM[i]/metal.elements.O.atMass));
            metal.V[i] = metal.W[i]/metal.density; 

            slag.TM[i] = slag.W[i] * ((slag.elements.FeO.perM[i]/slag.elements.FeO.atMass) + (slag.elements.SiO2.perM[i]/slag.elements.SiO2.atMass));
            slag.V[i] = slag.W[i]/slag.density;

            metal.VM[i] = metal.TM[i]/metal.V[i];
            slag.VM[i] = slag.TM[i]/slag.V[i];


            metal.elements.Fe.X[i] = metal.elements.Fe.KM[i]/metal.TM[i];
            metal.elements.Si.X[i] = metal.elements.Si.KM[i]/metal.TM[i];
            metal.elements.O.X[i] = metal.elements.O.KM[i]/metal.TM[i];
            slag.elements.FeO.X[i] = slag.elements.FeO.KM[i]/slag.TM[i];
            slag.elements.SiO2.X[i] = slag.elements.SiO2.KM[i]/slag.TM[i];



            metal.elements.Fe.bC[i] = metal.elements.Fe.KM[i]/metal.V[i];
            metal.elements.Si.bC[i] = metal.elements.Si.KM[i]/metal.V[i];
            metal.elements.O.bC[i] = metal.elements.O.KM[i]/metal.V[i];
            slag.elements.FeO.bC[i] = slag.elements.FeO.KM[i]/slag.V[i];
            slag.elements.SiO2.bC[i] = slag.elements.SiO2.KM[i]/slag.V[i];

            thermo.temperature = 1800 + (thermo.temprate * thermo.t);
            // console.log(oxygenAdded.OA[0]);

            // eqm constant canculations

            thermo.SiO2 = Math.exp((580541 - 220.655 * thermo.temperature - thermo.R * thermo.temperature * Math.log(0.5585/28)) / (thermo.R * thermo.temperature))
            thermo.FeO = Math.exp((121009.9 - 53.114 * thermo.temperature - thermo.R * thermo.temperature * Math.log(0.5585/16)) / (thermo.R * thermo.temperature))

            const FeiX = (slag.elements.FeO.X[i]  / ( metal.elements.O.X[i] * thermo.FeO ) ) ;
            const SiiX = (slag.elements.SiO2.X[i]  / ( Math.pow((metal.elements.O.X[i]),2) * thermo.SiO2 ) )

            const FeiC =  FeiX * metal.VM[i];
            const SiiC =  SiiX * metal.VM[i];
            


            metal.elements.Fe.J = -1 * metal.elements.Fe.k * (metal.elements.Fe.bC[i] - FeiC) * 0.1;
            metal.elements.Si.J = -1 * metal.elements.Si.k * (metal.elements.Si.bC[i] - SiiC) * 0.1;

            // area = 4m^2 and time step = 0.1
            metal.elements.Fe.tr = metal.elements.Fe.J * 0.1 * 4;
            metal.elements.Si.tr = metal.elements.Si.J * 0.1 * 4;

            metal.elements.O.tr = metal.elements.Fe.tr + 1.5 * metal.elements.Si.tr;


            //calculations


            metal.elements.Fe.KM[i+1] =(metal.elements.Fe.KM[i] + metal.elements.Fe.tr);
            metal.elements.Si.KM[i+1] =(metal.elements.Si.KM[i] + metal.elements.Si.tr);
            metal.elements.O.KM[i+1] =(metal.elements.O.KM[i] + metal.elements.O.tr + oxygenIn);

            slag.elements.FeO.KM[i+1] =(slag.elements.FeO.KM[i] - metal.elements.Fe.tr );
            slag.elements.SiO2.KM[i+1] =(slag.elements.SiO2.KM[i]- 0.5 *metal.elements.Si.tr );
            
            

            metal.W[i+1] = (metal.elements.Fe.KM[i+1] * metal.elements.Fe.atMass + metal.elements.Si.KM[i+1] * metal.elements.Si.atMass + metal.elements.O.KM[i+1] * metal.elements.O.atMass);
            slag.W[i+1] = (slag.elements.FeO.KM[i+1] * slag.elements.FeO.atMass + slag.elements.SiO2.KM[i+1] * slag.elements.SiO2.atMass);

            metal.elements.Fe.perM[i+1] = metal.elements.Fe.KM[i+1] * metal.elements.Fe.atMass / metal.W[i+1];
            metal.elements.Si.perM[i+1] = metal.elements.Si.KM[i+1] * metal.elements.Si.atMass / metal.W[i+1];
            metal.elements.O.perM[i+1] = metal.elements.O.KM[i+1] * metal.elements.O.atMass / metal.W[i+1];
            slag.elements.FeO.perM[i+1] = slag.elements.FeO.KM[i+1] * slag.elements.FeO.atMass / slag.W[i+1];
            slag.elements.SiO2.perM[i+1] = slag.elements.SiO2.KM[i+1] * slag.elements.SiO2.atMass / slag.W[i+1];


            thermo.t = thermo.t + 0.1;
        }
        return data;
};

// n is the number of (seconds/10)
const result = graphdata(data, 2000);

console.log(result.metal.W);