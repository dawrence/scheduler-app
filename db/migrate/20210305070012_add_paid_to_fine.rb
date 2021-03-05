class AddPaidToFine < ActiveRecord::Migration[5.2]
  def change
    add_column :fines, :paid, :boolean, default: false
  end
end
