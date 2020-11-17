
const metal = {
    "mass": 150000,
    "density": 7000,
    "area": 4,
    "elements" : {
        "Fe":{
            "atMass": 56,
            "percentMass": 0.849,
            "k": 0.025
        },
        "Cr":{
            "atMass": 52,
            "percentMass": 0.150,
            "k": 0.025
        },
        "O":{
            "atMass": 16,
            "percentMass": 0.001,
        }
    }
};

const slag = {
    "mass": 100,
    "density": 3500,
    "elements":{
        "FeO": {
            "atMass": 72,
            "percentMass": 0.5
        },
        "Cr2O3": {
            "atMass": 152,
            "percentMass": 0.5
        }
    }
};

const oxygenAdded = {
    "toprate": 200,
    "bottomrate": 300,
}

const thermo = {
    "temprate": 0.2,
    "t": 0,
    "R": 8.314
}

const data = {
    metal,slag,oxygenAdded,thermo
}

const step = 1;


// Steps Declaration



//repeat

const graphdata = (data, n) => {

    const metal = data.metal;
    const slag = data.slag;
    const oxygenAdded = data.oxygenAdded;
    const thermo = data.thermo;
        
    metal.VM = [];
    slag.VM = [];
    metal.TM = [];
    slag.TM = [];
    metal.W = [];
    slag.W = [];
    metal.V = [];
    slag.V = [];

    metal.elements.Fe.KM = [];
    metal.elements.Cr.KM = [];
    metal.elements.O.KM = [];
    slag.elements.FeO.KM = [];
    slag.elements.Cr2O3.KM = [];

    metal.elements.Fe.bC = [];
    metal.elements.Cr.bC = [];
    metal.elements.O.bC = [];
    slag.elements.FeO.bC = [];
    slag.elements.Cr2O3.bC = [];


    metal.elements.Fe.X = [];
    metal.elements.Cr.X = [];
    metal.elements.O.X = [];
    slag.elements.FeO.X = [];
    slag.elements.Cr2O3.X = [];

    metal.elements.Fe.perM = [];
    metal.elements.Cr.perM = [];
    metal.elements.O.perM = [];
    slag.elements.FeO.perM = [];
    slag.elements.Cr2O3.perM = [];

    
    metal.W[0] = metal.mass;
    slag.W[0] = slag.mass;

    metal.elements.Fe.perM[0] = metal.elements.Fe.percentMass;
    metal.elements.Cr.perM[0] = metal.elements.Cr.percentMass;
    metal.elements.O.perM[0] = metal.elements.O.percentMass;
    slag.elements.FeO.perM[0] = slag.elements.FeO.percentMass;
    slag.elements.Cr2O3.perM[0] = slag.elements.Cr2O3.percentMass;

    oxygenIn = ((oxygenAdded.toprate + oxygenAdded.bottomrate)/(22.4*60)) * (273/298) * 2;




    // console.log(slag.VM[0]);

    metal.elements.Fe.KM[0] =  ( metal.W[0] *  metal.elements.Fe.perM[0] )/metal.elements.Fe.atMass;
    metal.elements.Cr.KM[0] =  ( metal.W[0] *  metal.elements.Cr.perM[0] )/metal.elements.Cr.atMass;
    metal.elements.O.KM[0] = ( metal.W[0] *  metal.elements.O.perM[0] )/metal.elements.O.atMass + oxygenIn;
    slag.elements.FeO.KM[0] = ( slag.W[0] *  slag.elements.FeO.perM[0] )/slag.elements.FeO.atMass;
    slag.elements.Cr2O3.KM[0] = ( slag.W[0] *  slag.elements.Cr2O3.perM[0] )/slag.elements.Cr2O3.atMass;




        for (let i = 0; i<n; i++){


            metal.TM[i] = metal.W[i] * ((metal.elements.Fe.perM[i]/metal.elements.Fe.atMass) + (metal.elements.Cr.perM[i]/metal.elements.Cr.atMass) + (metal.elements.O.perM[i]/metal.elements.O.atMass)) + oxygenIn;
            metal.V[i] = metal.W[i]/metal.density; 

            slag.TM[i] = slag.W[i] * ((slag.elements.FeO.perM[i]/slag.elements.FeO.atMass) + (slag.elements.Cr2O3.perM[i]/slag.elements.Cr2O3.atMass));
            slag.V[i] = slag.W[i]/slag.density;

            metal.VM[i] = metal.TM[i]/metal.V[i];
            slag.VM[i] = slag.TM[i]/slag.V[i];


            metal.elements.Fe.X[i] = metal.elements.Fe.KM[i]/metal.TM[i];
            metal.elements.Cr.X[i] = metal.elements.Cr.KM[i]/metal.TM[i];
            metal.elements.O.X[i] = metal.elements.O.KM[i]/metal.TM[i];
            slag.elements.FeO.X[i] = slag.elements.FeO.KM[i]/slag.TM[i];
            slag.elements.Cr2O3.X[i] = slag.elements.Cr2O3.KM[i]/slag.TM[i];



            metal.elements.Fe.bC[i] = metal.elements.Fe.KM[i]/metal.V[i];
            metal.elements.Cr.bC[i] = metal.elements.Cr.KM[i]/metal.V[i];
            metal.elements.O.bC[i] = metal.elements.O.KM[i]/metal.V[i];
            slag.elements.FeO.bC[i] = slag.elements.FeO.KM[i]/slag.V[i];
            slag.elements.Cr2O3.bC[i] = slag.elements.Cr2O3.KM[i]/slag.V[i];

            thermo.temperature = 1600 + thermo.temprate * thermo.t;
            // console.log(oxygenAdded.OA[0]);

            
            thermo.Cr2O3 = Math.exp((274347 - 120.55 * thermo.temperature - thermo.R * thermo.temperature * Math.log(0.5585/16)) / (thermo.R * thermo.temperature))
            thermo.FeO = Math.exp((121009.9 - 53.114 * thermo.temperature - thermo.R * thermo.temperature * Math.log(0.5585/16)) / (thermo.R * thermo.temperature))

            const FeiX = (slag.elements.FeO.X[i]  / ( metal.elements.O.X[i] * thermo.FeO ) ) ;
            const CriX = Math.pow((Math.pow( slag.elements.Cr2O3.X[i], 1/3) / (metal.elements.O.X[i] * thermo.Cr2O3)),3/2);

            const FeiC =  FeiX * metal.VM[i];
            const CriC =  CriX * metal.VM[i];
            


            metal.elements.Fe.J = -1 * metal.elements.Fe.k * (metal.elements.Fe.bC[i] - FeiC) * 0.1;
            metal.elements.Cr.J = -1 * metal.elements.Cr.k * (metal.elements.Cr.bC[i] - CriC) * 0.1;

            
            metal.elements.Fe.tr = metal.elements.Fe.J * 1 * 4;
            metal.elements.Cr.tr = metal.elements.Cr.J * 1 * 4;

            metal.elements.O.tr = metal.elements.Fe.tr + 1.5 * metal.elements.Cr.tr;


            //calculations


            metal.elements.Fe.KM[i+1] =(metal.elements.Fe.KM[i] + metal.elements.Fe.tr);
            metal.elements.Cr.KM[i+1] =(metal.elements.Cr.KM[i] + metal.elements.Cr.tr);
            metal.elements.O.KM[i+1] =(metal.elements.O.KM[i] + metal.elements.O.tr + oxygenIn);

            slag.elements.FeO.KM[i+1] =(slag.elements.FeO.KM[i] - metal.elements.Fe.tr );
            slag.elements.Cr2O3.KM[i+1] =(slag.elements.Cr2O3.KM[i]- 0.5 *metal.elements.Cr.tr );
            
            

            metal.W[i+1] = (metal.elements.Fe.KM[i+1] * metal.elements.Fe.atMass + metal.elements.Cr.KM[i+1] * metal.elements.Cr.atMass + metal.elements.O.KM[i+1] * metal.elements.O.atMass);
            slag.W[i+1] = (slag.elements.FeO.KM[i+1] * slag.elements.FeO.atMass + slag.elements.Cr2O3.KM[i+1] * slag.elements.Cr2O3.atMass);

            metal.elements.Fe.perM[i+1] = metal.elements.Fe.KM[i+1] * metal.elements.Fe.atMass / metal.W[i+1];
            metal.elements.Cr.perM[i+1] = metal.elements.Cr.KM[i+1] * metal.elements.Cr.atMass / metal.W[i+1];
            metal.elements.O.perM[i+1] = metal.elements.O.KM[i+1] * metal.elements.O.atMass / metal.W[i+1];
            slag.elements.FeO.perM[i+1] = slag.elements.FeO.KM[i+1] * slag.elements.FeO.atMass / slag.W[i+1];
            slag.elements.Cr2O3.perM[i+1] = slag.elements.Cr2O3.KM[i+1] * slag.elements.Cr2O3.atMass / slag.W[i+1];


            thermo.t = thermo.t + 0.1;
        }
        return data;
};

// n is the number of seconds
const result = graphdata(data, 600);

console.log(result);