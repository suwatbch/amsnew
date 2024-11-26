class Enum {
    static StatusEnum = {
        ทั้งหมด: 0,
        ติดต่อจอง: 10,
    };

    static getStatusNameEnum(value) {
        for (let key in Enum.StatusEnum) {
            if (Enum.StatusEnum[key] === value) {
                return key;
            }
        }
        return null;
    }

    static BuildingEnum = {
        9:'A',
        8:'B',
        7:'C',
        5:'E',
        1:'F',
    }
    static getBuildingIDEnum(value) {
        for (let key in Enum.BuildingEnum) {
            if (Enum.BuildingEnum[key] === value) {
                return key;
            }
        }
        return null;
    }

}

module.exports = Enum;