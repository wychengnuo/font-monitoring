
/**
 * @param 权限表
 * @param 权限表对应---》role表 
 */

module.exports = function (sequelize, DataTypes) {
    const Project = sequelize.define('projects', {
        id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
        permissionsId: { type: DataTypes.STRING}   // 权限id
    },
        {
 
            
        // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': true,

        // 将updatedAt字段改个名
            'updatedAt': 'utime',

        // 将deletedAt字段改名
            'deletedAt': 'dtime'
        });
        Project.associate = (models) =>{
            Project.belongsTo(models.role);
    };
    
    return Project;
};