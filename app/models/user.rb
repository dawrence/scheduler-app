class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, 
         :rememberable, :validatable#, :recoverable, :registerable,
  enum role: %i[ admin scheduler treasurer student ]
end
