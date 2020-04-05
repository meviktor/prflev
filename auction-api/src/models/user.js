import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});

userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(function(err, passwordSalt) {
        if(err) return next(err);

        bcrypt.hash(user.password, passwordSalt, function(err, hashedPassword) {
            if(err) return next(err);

            user.password = hashedPassword;
            return next();
        });
    });
});

userSchema.methods.isPasswordValid = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const user = mongoose.model('User', userSchema);

export default user;